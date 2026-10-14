import json
from pathlib import Path

import gpxpy


SCRIPT_DIR = Path(__file__).resolve().parent
OUTPUT_PATH = SCRIPT_DIR / "map_data.json"


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
        f"{len(map_data['route'])} route points."
    )


if __name__ == "__main__":
    main()
