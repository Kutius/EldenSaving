// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod save;
use save::{get_folder_list, FileEntry};
use std::fs::{self, File};
use std::io::{Read, Write};

// use chrono::Local;
// use std::sync::mpsc::{self, Receiver, Sender};
// use std::thread;
// use std::time::Duration;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// enum Command {
//     Pause,
//     Resume,
// }

// fn timer_task(rx: Receiver<Command>) {
//     let mut paused = true;
//     loop {
//         match rx.try_recv() {
//             Ok(Command::Pause) => paused = true,
//             Ok(Command::Resume) => paused = false,
//             Err(_) => (),
//         }

//         if !paused {
//             // 打印时间
//             println!(
//                 "{}: 自动保存成功！",
//                 Local::now().format("%Y-%m-%d %H:%M:%S")
//             );
//         }

//         thread::sleep(Duration::from_secs(5 * 60));
//     }
// }

// static mut TX: Option<Sender<Command>> = None;

// fn start_timer() {
//     let (tx, rx) = mpsc::channel();
//     unsafe {
//         TX = Some(tx);
//     }
//     thread::spawn(move || timer_task(rx));
// }

// #[tauri::command]
// fn pause_timer() {
//     unsafe {
//         if let Some(tx) = &TX {
//             tx.send(Command::Pause).unwrap();
//         }
//     }
// }

// #[tauri::command]
// fn resume_timer() {
//     unsafe {
//         if let Some(tx) = &TX {
//             tx.send(Command::Resume).unwrap();
//         }
//     }
// }

#[tauri::command]
fn read_dir(path: String) -> Vec<FileEntry> {
    return get_folder_list(path);
}

#[tauri::command]
fn read_env(key: String) -> String {
    return std::env::var(key).unwrap();
}

#[tauri::command]
fn create_dir(path: String) {
    fs::create_dir(path).unwrap();
}

#[tauri::command]
fn read_file(file: String) -> String {
    // 打开文件，读取内容，并返回
    let mut file = File::open(file).unwrap();
    let mut content = String::new();
    file.read_to_string(&mut content).unwrap();

    content
}

#[tauri::command]
fn write_file(path: String, contents: String) -> () {
    let mut file = File::create(path).unwrap();
    file.write_all(contents.as_bytes()).unwrap();
}

#[tauri::command]
fn copy_file(src: String, dst: String) -> () {
    fs::copy(src, dst).unwrap();
}

#[tauri::command]
fn remove_file(path: String) -> () {
    fs::remove_file(path).unwrap();
}

fn main() {
    // start_timer();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            read_dir,
            read_env,
            create_dir,
            read_file,
            write_file,
            copy_file,
            remove_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
