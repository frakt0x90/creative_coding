import cairo
from typing import Tuple, List
from math import pi, cos, sin, sqrt

phi = ( 1 + sqrt(5) ) / 2

def fibo_list(n: int, mod: int = 360) -> List[int]:
    vals = [1]
    a = 1
    b = 1
    for i in range(n-1):
        vals.append(b)
        a,b = b, a+b
    return map(lambda x: x % mod, vals)

def to_rad(angle: float) -> float:
    return (angle % 360) * (pi / 180)

def bouncer(init_point:Tuple[int, int], stroke_length: float, angles: List[float]) -> List[Tuple[int, int]]:
    '''Takes list of angle and an initial point. For every angle a, we rotate a degrees and walk forward stroke_length.
    This function returns the coordinates of all those steps'''

    coords = [init_point]
    point = init_point
    radians = 0
    for angle in angles:
        radians = (radians + to_rad(angle)) % (2 * pi)
        new_point = (point[0] + stroke_length * cos(radians), point[1] + stroke_length * sin(radians))
        coords.append(new_point)
        point = new_point
    return coords

def scale_coords(scale: int, coords: Tuple[float, float]) -> Tuple[float, float]:
    return (coords[0] / scale, coords[1] / scale)

scale = 1024
with cairo.SVGSurface("normie_fib.svg", scale, scale) as surface:
    context = cairo.Context(surface)
    init_x, init_y = (scale / 2, scale / 2)
    context.scale(scale, scale)
    context.set_line_width(0.001)
    context.set_source_rgba(0.69, 0.5, 1, 1)
    context.set_line_cap(cairo.LineCap.ROUND)
    context.set_line_join(cairo.LineJoin.ROUND)

    points = bouncer((init_x, init_y), 30, fibo_list(1000, 45))
    points = map(lambda p: scale_coords(scale, p), points)
    context.move_to(*scale_coords(scale, (init_x, init_y)))
    for p in points:
        context.line_to(*p)
    context.stroke()