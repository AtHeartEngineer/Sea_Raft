use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::CanvasRenderingContext2d;
extern crate console_error_panic_hook;

const DENSITY: usize = 100; // lower = more dense
const HUE_START: usize = 120;
const HUE_END: usize = 230;
const MAX_SIZE: usize = 2;
const MIN_LIGHT: usize = 33;
const MAX_LIGHT: usize = 67;
const MIN_TRANSPARENCY: usize = 10;
const MAX_TRANSPARENCY: usize = 60;
const SATURATION: usize = 100;
const START_ANGLE: f64 = 4.18; // 240 degrees
const END_ANGLE: f64 = 5.24; // 300 degrees
const MAX_SPEED: usize = 2;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct Universe {
    context: CanvasRenderingContext2d,
    width: usize,
    height: usize,
}

#[wasm_bindgen]
#[allow(clippy::new_without_default)]
impl Universe {
    #[wasm_bindgen]
    pub fn new() -> Self {
        init_panic_hook();
        let (width, height) = get_window_size();

        let document = web_sys::window().unwrap().document().unwrap();
        let canvas = document.get_element_by_id("game").unwrap();
        let canvas: web_sys::HtmlCanvasElement = canvas
            .dyn_into::<web_sys::HtmlCanvasElement>()
            .map_err(|_| ())
            .unwrap();

        let context = canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<web_sys::CanvasRenderingContext2d>()
            .unwrap();

        Self {
            context,
            width,
            height,
        }
    }

    pub fn tick(&mut self) {
        self.draw();
    }

    fn draw(&mut self) {
        self.reset_canvas();
    }

    pub fn reset_canvas(&mut self) {
        let (width, height) = get_window_size();
        if (width != self.width) || (height != self.height) {
            self.width = width;
            self.height = height;
        }
        self.context.begin_path();
        self.context.set_fill_style(&"rgb(0,0,0)".into());
        self.context
            .fill_rect(0.0, 0.0, width as f64, height as f64);
        self.context.close_path();
    }
}

pub fn resize_canvas(canvas: &web_sys::HtmlCanvasElement) {
    let (width, height) = get_window_size();
    canvas.set_width(width as u32);
    canvas.set_height(height as u32);
    log!("Canvas Resized to {}x{}", width, height);
}

pub fn get_window_size() -> (usize, usize) {
    let width = web_sys::window()
        .unwrap()
        .inner_width()
        .unwrap()
        .as_f64()
        .unwrap();
    let height = web_sys::window()
        .unwrap()
        .inner_height()
        .unwrap()
        .as_f64()
        .unwrap();
    (width as usize, height as usize)
}

pub fn random_range(min: usize, max: usize) -> usize {
    let rand = js_sys::Math::random();
    let range = max - min;
    let rand_range = (rand * range as f64) as usize;
    rand_range + min
}

pub fn random_range_f64(min: f64, max: f64) -> f64 {
    let rand = js_sys::Math::random();
    let range = max - min;
    let rand_range = rand * range;
    rand_range + min
}
