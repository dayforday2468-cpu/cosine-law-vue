import json
from pathlib import Path

import gpxpy
from PIL import ExifTags, Image


SCRIPT_DIR = Path(__file__).resolve().parent
PHOTOS_DIR = SCRIPT_DIR / "photos"
OUTPUT_PATH = SCRIPT_DIR / "map_data.json"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def read_gpx(gpx_path: str | Path) -> list[dict]:
    """Read GPX track points into a frontend-friendly route list."""
    gpx_path = Path(gpx_path)

    with gpx_path.open(encoding="utf-8") as file:
        gpx = gpxpy.parse(file)

    route = []

    for track in gpx.tracks:
        for segment in track.segments:
            for point in segment.points:
                route.append(
                    {
                        "latitude": point.latitude,
                        "longitude": point.longitude,
                        "elevation": point.elevation,
                        "timestamp": (
                            point.time.isoformat()
                            if point.time is not None
                            else None
                        ),
                    }
                )

    return route


def _dms_to_decimal(dms, reference: str) -> float:
    degrees, minutes, seconds = (float(value) for value in dms)
    decimal = degrees + minutes / 60 + seconds / 3600

    if reference in {"S", "W"}:
        decimal *= -1

    return decimal


def extract_photo_location(photo_path: str | Path) -> dict | None:
    """Extract latitude and longitude from a photo's EXIF GPS metadata."""
    photo_path = Path(photo_path)

    with Image.open(photo_path) as image:
        exif = image.getexif()

    if not exif:
        return None

    gps_ifd = exif.get_ifd(ExifTags.IFD.GPSInfo)

    if not gps_ifd:
        return None

    gps = {
        ExifTags.GPSTAGS.get(tag_id, tag_id): value
        for tag_id, value in gps_ifd.items()
    }

    latitude = gps.get("GPSLatitude")
    latitude_ref = gps.get("GPSLatitudeRef")
    longitude = gps.get("GPSLongitude")
    longitude_ref = gps.get("GPSLongitudeRef")

    if not all((latitude, latitude_ref, longitude, longitude_ref)):
        return None

    if isinstance(latitude_ref, bytes):
        latitude_ref = latitude_ref.decode("ascii")

    if isinstance(longitude_ref, bytes):
        longitude_ref = longitude_ref.decode("ascii")

    return {
        "latitude": _dms_to_decimal(latitude, latitude_ref),
        "longitude": _dms_to_decimal(longitude, longitude_ref),
    }


def find_gpx_file() -> Path:
    gpx_files = sorted(SCRIPT_DIR.glob("*.gpx"))

    if len(gpx_files) != 1:
        raise RuntimeError(
            f"Expected exactly one GPX file in {SCRIPT_DIR}, "
            f"but found {len(gpx_files)}."
        )

    return gpx_files[0]


def read_photo_locations() -> list[dict]:
    if not PHOTOS_DIR.exists():
        raise FileNotFoundError(f"Photos directory not found: {PHOTOS_DIR}")

    photos = []

    for photo_path in sorted(PHOTOS_DIR.iterdir()):
        if (
            not photo_path.is_file()
            or photo_path.suffix.lower() not in IMAGE_EXTENSIONS
        ):
            continue

        location = extract_photo_location(photo_path)

        if location is None:
            continue

        photos.append(
            {
                "filename": photo_path.name,
                **location,
            }
        )

    return photos


def main() -> None:
    gpx_path = find_gpx_file()

    map_data = {
        "route": read_gpx(gpx_path),
        "photos": read_photo_locations(),
    }

    OUTPUT_PATH.write_text(
        json.dumps(
            map_data,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(
        f"Created {OUTPUT_PATH.name}: "
        f"{len(map_data['route'])} route points, "
        f"{len(map_data['photos'])} geotagged photos."
    )


if __name__ == "__main__":
    main()
