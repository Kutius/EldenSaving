// // use chrono::Local;
// use std::env;

// const GAME_PATH: &str = "\\EldenRing";
// const SL_PATH: &str = "\\ER0000.sl2";

use serde::{Serialize, Deserialize};

// fn get_game_path() -> String {
//     // 获取appdata路径
//     let appdata = env::var("APPDATA").unwrap();
//     // 拼接路径
//     let path = format!("{}{}", appdata, GAME_PATH);
//     path
// }
#[derive(Serialize, Deserialize)]
pub struct FileEntry {
    name: String,
    is_dir: bool,
}

// // 获取路径下的文件列表
pub fn get_folder_list(path: String) -> Vec<FileEntry> {
    let mut entry_list: Vec<FileEntry> = Vec::new();
    if let Ok(entries) = std::fs::read_dir(path) {
        for entry in entries {
            if let Ok(entry) = entry {
                let file_name = entry.file_name().into_string().unwrap();
                let is_dir = entry.file_type().unwrap().is_dir();
                let entry = FileEntry {
                    name: file_name,
                    is_dir,
                };
                entry_list.push(entry);
            }
        }
    }
    entry_list
}

// fn main() {
//     // 获取游戏路径
//     let game_path = get_game_path();
//     // 获取游戏路径下的文件夹列表
//     let folder_list = get_folder_list(game_path.clone());
//     // 打印文件夹列表
//     let target = "76561198438622263";
//     let sl_path = format!("{}\\{}", game_path, target);
// }
