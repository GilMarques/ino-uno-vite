import math


class CoordinateHelper:
    @staticmethod
    def to_world_space(
        local_pos: tuple[float, float],
        player_pos: tuple[float, float],
        player_angle: float,
    ):
        x, y = local_pos
        px, py = player_pos
        cos_a, sin_a = math.cos(player_angle), math.sin(player_angle)
        return (
            px + (x * cos_a - y * sin_a),
            py + (x * sin_a + y * cos_a),
        )

    @staticmethod
    def to_local_space(
        world_pos: tuple[float, float],
        player_pos: tuple[float, float],
        player_angle: float,
    ):
        wx, wy = world_pos
        px, py = player_pos
        cos_a, sin_a = math.cos(-player_angle), math.sin(-player_angle)
        return (
            (wx - px) * cos_a - (wy - py) * sin_a,
            (wx - px) * sin_a + (wy - py) * cos_a,
        )
