mod enemies;
mod game;
mod player;
mod properties;
mod utils;
mod weapons;
mod world;
use bevy::prelude::*;
use bevy::render::mesh::Indices;
use bevy::render::render_resource::PrimitiveTopology;
use bevy::sprite::MaterialMesh2dBundle;
use bevy_rapier2d::prelude::*;
use std::f32::{self, consts::PI};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

const TIME_STEP: f32 = 1.0 / 60.0;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn start() {
    App::new()
        .insert_resource(WindowDescriptor {
            title: "Sea Raft Game".to_string(),
            fit_canvas_to_parent: true,
            resizable: true,
            mode: bevy::window::WindowMode::Windowed,
            #[cfg(target_arch = "wasm32")]
            canvas: Some("#game".to_string()),
            ..Default::default()
        })
        .add_plugin(RapierPhysicsPlugin::<NoUserData>::pixels_per_meter(100.0))
        .add_plugin(RapierDebugRenderPlugin::default())
        .add_startup_system(setup_graphics)
        .add_startup_system(setup_physics)
        .add_system(print_ball_altitude)
        .add_plugins(DefaultPlugins)
        .run();
}

#[derive(Component)]
struct Position(Vec2);

#[derive(Component)]
struct Velocity(Vec2);

fn setup_graphics(mut commands: Commands) {
    // Add a camera
    commands.spawn_bundle(Camera2dBundle::default());
}

fn setup_physics(mut commands: Commands) {
    /* Create the ground. */
    commands
        .spawn()
        .insert(Collider::cuboid(500.0, 50.0))
        .insert_bundle(TransformBundle::from(Transform::from_xyz(0.0, -100.0, 0.0)));

    /* Create the bouncing ball. */
    commands
        .spawn()
        .insert(RigidBody::Dynamic)
        .insert(Collider::ball(50.0))
        .insert(Restitution::coefficient(0.7))
        .insert_bundle(TransformBundle::from(Transform::from_xyz(0.0, 400.0, 0.0)));
}

fn setup(
    mut commands: Commands,
    mut windows: ResMut<Windows>,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<ColorMaterial>>,
) {
    commands.spawn_bundle(Camera2dBundle::default());

    commands
        .spawn()
        .insert(Starship {
            rotation_angle: 0.0,
        })
        .insert(Position(Vec2::splat(0.0)))
        .insert(Velocity(Vec2::splat(0.0)))
        .insert_bundle(MaterialMesh2dBundle {
            mesh: meshes.add(create_starship_mesh()).into(),
            transform: Transform::default()
                .with_scale(Vec3::splat(50.0))
                .with_translation(Vec3::new(0.0, 0.0, 1.0)),
            material: materials.add(ColorMaterial::from(Color::rgba(1.0, 0.0, 0.0, 1.0))),
            ..default()
        });
}

#[derive(Component)]
struct Starship {
    rotation_angle: f32,
}

impl Starship {
    fn direction(&self) -> Vec2 {
        let (y, x) = (self.rotation_angle + PI / 2.0).sin_cos();

        Vec2::new(x, y)
    }
}

fn create_starship_mesh() -> Mesh {
    let mut mesh = Mesh::new(PrimitiveTopology::TriangleList);

    mesh.insert_attribute(
        Mesh::ATTRIBUTE_POSITION,
        vec![[0.0, 0.5, 0.0], [-0.25, -0.5, 0.0], [0.25, -0.5, 0.0]],
    );
    mesh.set_indices(Some(Indices::U32(vec![0, 1, 2])));
    mesh.insert_attribute(Mesh::ATTRIBUTE_NORMAL, vec![[0.0, 0.0, 1.0]; 3]);
    mesh.insert_attribute(
        Mesh::ATTRIBUTE_UV_0,
        vec![[0.5, 0.0], [0.0, 1.0], [1.0, 1.0]],
    );

    mesh
}

fn print_ball_altitude(positions: Query<&Transform, With<RigidBody>>) {
    for transform in positions.iter() {
        println!("Ball altitude: {}", transform.translation.y);
    }
}
