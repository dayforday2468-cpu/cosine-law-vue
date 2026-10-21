import json
from datetime import datetime
from math import asin, cos, radians, sin, sqrt
from pathlib import Path

import gpxpy
from exif import Image


SCRIPT_DIR = Path(__file__).resolve().parent
PHOTO_DIR = SCRIPT_DIR / "photos"
OUTPUT_PATH = SCRIPT_DIR / "map_data.json"

PHOTO_EXTENSIONS = {".jpg", ".jpeg"}
EARTH_RADIUS_METERS = 6_371_000


def calculate_distance_meters(
    start: dict,
    end: dict,
) -> float:
    """Calculate the great-circle distance between two route points."""
    start_latitude = radians(start["latitude"])
    end_latitude = radians(end["latitude"])
    latitude_delta = end_latitude - start_latitude
    longitude_delta = radians(
        end["longitude"] - start["longitude"],
    )

    haversine = (
        sin(latitude_delta / 2) ** 2
        + cos(start_latitude)
        * cos(end_latitude)
        * sin(longitude_delta / 2) ** 2
    )

    return (
        2
        * EARTH_RADIUS_METERS
        * asin(sqrt(haversine))
    )


def add_route_metrics(route: list[dict]) -> list[dict]:
    """Add cumulative distance in meters and speed in meters per second."""
    cumulative_distance = 0.0

    for index, point in enumerate(route):
        if index == 0:
            point["cumulativeDistance"] = 0.0
            point["speed"] = 0.0
            continue

        previous = route[index - 1]
        segment_distance = calculate_distance_meters(
            previous,
            point,
        )
        cumulative_distance += segment_distance

        speed = 0.0
        previous_timestamp = previous["timestamp"]
        current_timestamp = point["timestamp"]

        if (
            previous_timestamp is not None
            and current_timestamp is not None
        ):
            elapsed_seconds = (
                datetime.fromisoformat(current_timestamp)
                - datetime.fromisoformat(previous_timestamp)
            ).total_seconds()

            if elapsed_seconds > 0:
                speed = segment_distance / elapsed_seconds

        point["cumulativeDistance"] = round(
            cumulative_distance,
            3,
        )
        point["speed"] = round(speed, 3)

    return route


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

    return add_route_metrics(route)


def dms_to_decimal(
    degrees: float,
    minutes: float,
    seconds: float,
) -> float:
    """Convert EXIF DMS coordinates to decimal degrees."""
    return degrees + minutes / 60 + seconds / 3600


def read_photo(photo_path: str | Path) -> dict | None:
    """Read GPS coordinates and asset information from a photo."""
    photo_path = Path(photo_path)

    with photo_path.open("rb") as file:
        image = Image(file)

    if not image.has_exif:
        return None

    exif_data = image.get_all()

    required_gps_fields = {
        "gps_latitude",
        "gps_longitude",
        "gps_latitude_ref",
        "gps_longitude_ref",
    }

    if not required_gps_fields <= exif_data.keys():
        return None

    latitude = dms_to_decimal(
        *exif_data["gps_latitude"],
    )
    longitude = dms_to_decimal(
        *exif_data["gps_longitude"],
    )

    if exif_data["gps_latitude_ref"] == "S":
        latitude *= -1

    if exif_data["gps_longitude_ref"] == "W":
        longitude *= -1

    return {
        "sourceFilename": photo_path.name,
        "assetKey": f"{photo_path.stem}.webp",
        "latitude": latitude,
        "longitude": longitude,
    }


def read_photos(photo_dir: str | Path) -> list[dict]:
    """Read map data from photos containing GPS EXIF metadata."""
    photo_dir = Path(photo_dir)

    photos = []

    for photo_path in sorted(photo_dir.iterdir()):
        if photo_path.suffix.lower() not in PHOTO_EXTENSIONS:
            continue

        photo = read_photo(photo_path)

        if photo is not None:
            photos.append(photo)

    return photos


def find_gpx_file() -> Path:
    gpx_files = sorted(SCRIPT_DIR.glob("*.gpx"))

    if len(gpx_files) != 1:
        raise RuntimeError(
            f"Expected exactly one GPX file in {SCRIPT_DIR}, "
            f"but found {len(gpx_files)}."
        )

    return gpx_files[0]


def main() -> None:
    gpx_path = find_gpx_file()

    map_data = {
        "route": read_gpx(gpx_path),
        "photos": read_photos(PHOTO_DIR),
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
        f"{len(map_data['photos'])} photos."
    )


if __name__ == "__main__":
    main()