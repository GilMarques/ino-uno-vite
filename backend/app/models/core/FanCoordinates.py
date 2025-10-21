import math
from dataclasses import dataclass
from typing import Literal

Direction = Literal["N", "S", "E", "W"]


def degrees_to_radians(degrees: float) -> float:
    return degrees * (math.pi / 180.0)


def radians_to_degrees(radians: float) -> float:
    return radians * (180.0 / math.pi)


def get_rotated_dimensions(
    angle_deg: float, width: float, height: float
) -> tuple[int, int]:
    angle = degrees_to_radians(angle_deg)
    sin_a = math.sin(angle)
    cos_a = math.cos(angle)

    x1, y1 = cos_a * width, sin_a * width
    x2, y2 = -sin_a * height, cos_a * height
    x3, y3 = cos_a * width - sin_a * height, sin_a * width + cos_a * height

    min_x = min(0, x1, x2, x3)
    max_x = max(0, x1, x2, x3)
    min_y = min(0, y1, y2, y3)
    max_y = max(0, y1, y2, y3)

    return (math.floor(max_x - min_x), math.floor(max_y - min_y))


def rotate_point_in_box(
    x: float, y: float, angle_deg: float, width: float, height: float
) -> tuple[float, float]:
    angle = degrees_to_radians(angle_deg)
    center_x = width / 2.0
    center_y = height / 2.0

    dx = x - center_x
    dy = y - center_y
    dist = math.sqrt(dx * dx + dy * dy)
    a = math.atan2(dy, dx) + angle

    dx2 = math.cos(a) * dist
    dy2 = math.sin(a) * dist

    return (dx2 + center_x, dy2 + center_y)


def calculate_fan_coordinates(
    num_cards: int,
    arc_radius: float,
    card_width: float,
    card_height: float,
    direction: Direction,
    card_spacing: float,
):
    if num_cards <= 0:
        return []

    # angle between each card
    angle_per_card = radians_to_degrees(
        math.atan((card_width * card_spacing) / arc_radius)
    )
    angle_offset = {"N": 270, "S": 90, "E": 0, "W": 180}[direction]
    start_angle = angle_offset - 0.5 * angle_per_card * (num_cards - 1)

    coords = []
    min_x, min_y = 99999, 99999
    max_x, max_y = -99999, -99999

    for i in range(num_cards):
        degrees_angle = start_angle + angle_per_card * i
        radians_angle = degrees_to_radians(degrees_angle)

        x = card_width / 2 + math.cos(radians_angle) * arc_radius
        y = card_height / 2 + math.sin(radians_angle) * arc_radius

        min_x = min(min_x, x)
        min_y = min(min_y, y)
        max_x = max(max_x, x)
        max_y = max(max_y, y)

        coords.append({"x": x, "y": y, "angle": degrees_angle + 90})

    rotated_w, rotated_h = get_rotated_dimensions(
        coords[0]["angle"], card_width, card_height
    )
    offset_x, offset_y = 0.0, 0.0

    if direction == "N":
        offset_x = -min_x + (rotated_w - card_width) / 2
        offset_y = -min_y
    elif direction == "S":
        offset_x = -min_x + (rotated_w - card_width) / 2
        offset_y = -(min_y + (max_y - min_y))
    elif direction == "W":
        offset_y = -min_y + (rotated_h - card_height) / 2
        offset_x = (
            -min_x
            + card_height
            - rotate_point_in_box(0, 0, 270, card_width, card_height)[1]
        )
    elif direction == "E":
        offset_y = -min_y + (rotated_h - card_height) / 2
        offset_x = -arc_radius - (
            card_height - rotate_point_in_box(0, 0, 270, card_width, card_height)[1]
        )

    # Apply offsets and convert angles to radians
    for coord in coords:
        coord["x"] = round(coord["x"] + offset_x)
        coord["y"] = round(coord["y"] + offset_y)
        coord["angle"] = degrees_to_radians(round(coord["angle"]))

    return coords


@dataclass
class FanCoordinates:
    x: float
    y: float
    angle: float


Coords_Cache = dict[int, list[FanCoordinates]]


def build_coords_cache(max_cards: int = 52) -> Coords_Cache:
    coords_cache = {0: []}
    for n in range(1, max_cards + 1):
        coords = calculate_fan_coordinates(n, 750, 200, 400, "S", 0.4)
        m = n // 2
        if n % 2 == 0:
            center_x = (coords[m - 1]["x"] + coords[m]["x"]) / 2
        else:
            center_x = coords[m]["x"]
        for c in coords:
            c["x"] -= center_x
        coords_cache[n] = [FanCoordinates(**c) for c in coords]
    return coords_cache
