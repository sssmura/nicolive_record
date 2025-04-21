

export async function exec_ffmpeg_ts_record(m3u8Url: string, cookieHeaderValue: string) {
  // 実行したいFFmpegコマンド: ffmpeg -headers <ヘッダー> -i <URL> -c copy output.ts

  // 出力ファイル名 (拡張子を .ts に変更)
  const outputFilename: string = "./output/" + Date.now().toString() + "_output_full.ts"; // <--- 拡張子を .ts に変更

  const ffmpegCommandPath: string = "ffmpeg";
  const userAgentHeaderValue =
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"; // User Agentは最新版を適宜確認・更新推奨
  const refererHeaderValue = "https://live.nicovideo.jp/"; // 必要に応じて変更または削除
  const headers =
    `Cookie: ${cookieHeaderValue}\r\nUser-Agent: ${userAgentHeaderValue}\r\nReferer: ${refererHeaderValue}`;

  console.log(`録画を開始します (TS Recording):`); // <--- ログ変更
  console.log(`  入力URL: ${m3u8Url}`);
  console.log(`  出力ファイル: ${outputFilename}`); // <--- 出力ファイル名確認
  console.log(`  追加ヘッダー: Cookie, User-Agent, Referer`);
  console.log("FFmpegを実行中... (ストリーム終了または手動停止まで継続します)"); // <--- ログ変更 (-t オプションがない場合)
  // もし時間制限を設けたい場合は -t オプションを再度有効にしてください
  // console.log("FFmpegを実行中... (約XX秒で自動停止します)"); // -t オプション使用時

  try {
    // Deno.Commandを使用 (Deno v1.?)
    const command = new Deno.Command(ffmpegCommandPath, {
      args: [
        "-headers",
        headers,
        "-i",
        m3u8Url,
        "-c",       // コーデックはコピー (再エンコードしない)
        "copy",
        // "-t",    // 時間制限が必要な場合はコメント解除して秒数を指定
        // "60",
        // --- 出力ファイル名を .ts に変更 ---
        outputFilename, // <--- .ts 拡張子のファイル名を使用
      ],
      stdout: "inherit", // ffmpegの標準出力をそのまま表示
      stderr: "inherit", // ffmpegの標準エラー出力をそのまま表示
    });

    const childProcess = command.spawn();
    const status = await childProcess.status;

    if (status.success) {
      console.log(
        `\nFFmpegプロセスが正常に終了しました。TSファイルが保存されました: ${outputFilename}`, // <--- ログ変更
      );
    } else {
      console.error(
        `\nFFmpegプロセスがエラーで終了しました。終了コード: ${status.code}`,
        // エラーヒントは -c copy 一般に関するものとして残しても良い
        "\n考えられる原因: 入力ストリームの問題、ネットワークエラー、またはコーデックの問題など。"
      );
    }
  } catch (error) {
    console.error("\nFFmpegの実行中にエラーが発生しました:", error);
    // Deno v1.9以降では instanceof Deno.errors.NotFound を使用
    if (error instanceof Deno.errors.NotFound) {
      console.error(
        "エラー: 'ffmpeg' コマンドが見つかりません。FFmpegがインストールされ、PATH環境変数に追加されているか確認してください。",
      );
    } else {
      // その他のエラー
      console.error("予期せぬエラー:", (error as Deno.errors.NotFound).message);
    }
  }
}
