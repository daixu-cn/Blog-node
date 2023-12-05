import fs from "fs-extra";
import parst from "url-parse";
import path from "path";
import FileType from "file-type";
import { ASSET_DIR, ASSET_PREFIX, WATERMARK } from "@/config/env";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * @description 删除指定视频文件的资源
 * @param {string}  filepath 文件路径
 * @param {boolean} deleteSourceVideo 是否删除视频源文件
 */
export async function destroyVideoAssets(filepath: string, deleteSourceVideo = true) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const parsedUrl = parst(filepath);
      const pathname = parsedUrl.pathname.replace(ASSET_DIR, "");
      if (pathname) {
        const videopath = `${ASSET_DIR}${pathname}`;

        const type = await FileType.fromFile(videopath);
        if (type && type.mime.split("/")[0] === "video") {
          if (deleteSourceVideo) {
            fs.remove(videopath);
          }
          // 文件名(不包含后缀)
          const filename = path.basename(pathname, path.extname(pathname));
          if (filename && fs.existsSync(`${ASSET_DIR}/video/m3u8/${filename}.m3u8`)) {
            const files = fs.readdirSync(`${ASSET_DIR}/video/m3u8`);
            for (const name of files) {
              if (name.startsWith(filename)) {
                fs.remove(`${ASSET_DIR}/video/m3u8/${name}`);
              }
            }
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @description 视频转换为HLS格式（M3U8）
 * @param {string} input 视频源文件路径
 * @param {string} filename 文件名（不包含后缀）
 * @return {string} 返回M3U8文件地址
 */
export function toHLS(input: string, filename: string) {
  return new Promise<string>((resolve, reject) => {
    try {
      const OUTPUT_DIR = `${ASSET_DIR}/video/m3u8`;
      fs.ensureDirSync(OUTPUT_DIR);

      const watermarkScale = "iw/10:-1"; // 水印缩放比例
      const watermarkOffset = "'(min(main_w,main_h)*0.02)'"; // 水印偏移量

      ffmpeg(input)
        .videoCodec("libx264") // 设置视频编解码器
        .format("hls") // 输出视频格式
        .videoFilters(
          `movie=${WATERMARK},scale=${watermarkScale} [watermark]; [in][watermark] overlay=W-w-${watermarkOffset}:${watermarkOffset} [out]`
        ) // 添加水印
        .outputOptions("-hls_list_size 0") //  -hls_list_size n:设置播放列表保存的最多条目，设置为0会保存有所片信息，默认值为5
        .outputOption("-hls_time 2") // -hls_time n: 设置每片的长度，默认值为2。单位为秒
        .output(`${OUTPUT_DIR}/${filename}.m3u8`) // 输出文件
        .on("end", () => {
          resolve(`${ASSET_PREFIX}/video/m3u8/${filename}.m3u8`);
        })
        .on("error", error => {
          reject(error);
        })
        .run(); // 执行
    } catch (error) {
      reject(error);
    }
  });
}
