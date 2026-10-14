from pathlib import Path
import xml.etree.ElementTree as ET

from PIL import ExifTags, Image


def read_gpx(gpx_path: str | Path) -> list[dict]:
    """Read GPX track points into a frontend-friendly route list."""
    gpx_path = Path(gpx_path)
    root = ET.parse(gpx_path).getroot()

    namespace = ""
    if root.tag.startswith("{"):
        namespace = root.tag.split("}", 1)[0] + "}"

    route = []

    for track_point in root.iter(f"{namespace}trkpt"):
        latitude = float(track_point.attrib["lat"])
        longitude = float(track_point.attrib["lon"])

        elevation_element = track_point.find(f"{namespace}ele")
        time_element = track_point.find(f"{namespace}time")

        route.append(
            {
                "latitude": latitude,
                "longitude": longitude,
                "elevation": (
                    float(elevation_element.text)
                    if elevation_element is not None and elevation_element.text
                    else None
                ),
                "timestamp": (
                    time_element.text
                    if time_element is not None and time_element.text
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
