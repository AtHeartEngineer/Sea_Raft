use std::cmp;

pub struct Vector(isize, isize);

pub fn get_distance(p1: &Vector, p2: &Vector) -> usize {
    let y = p2.0 - p1.0;
    let x = p2.1 - p1.1;
    let square = (x * x + y * y) as f64;
    square.sqrt() as usize
}

pub fn scale_value(value: usize, from: Vec<usize>, to: Vec<usize>) -> usize {
    let scale = (to[1] - to[0]) / (from[1] - from[0]);
    let capped = cmp::min(from[1], cmp::max(from[0], value)) - from[0];
    capped * scale + to[0]
}

pub fn normalize_vector(vector: &Vector) -> Vector {
    let p1 = Vector(0, 0);
    let distance = get_distance(&p1, vector);
    Vector(&vector.0 / distance as isize, &vector.1 / distance as isize)
}

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}
