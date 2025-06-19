/**
 * ダウンロード管理クラス
 */
class DownloadManager {
  constructor(imageGenerator) {
    this.imageGenerator = imageGenerator;
  }

  /**
   * 全画像をZIPでダウンロード
   */
  async downloadAllImages() {
    const images = this.imageGenerator.getGeneratedImages();
    
    if (images.length === 0) {
      alert('ダウンロードする画像がありません。先に画像を生成してください。');
      return;
    }

    try {
      // JSZipを使用してZIPファイルを作成
      const zip = new JSZip();
      const imgFolder = zip.folder('images');
      
      images.forEach(img => {
        const base64 = img.data.replace(/^data:image\/\w+;base64,/, '');
        imgFolder.file(img.filename, base64, { base64: true });
      });
      
      // ZIPファイルを生成してダウンロード
      const content = await zip.generateAsync({ type: 'blob' });
      this.downloadBlob(content, 'generated_images.zip');
      
    } catch (error) {
      console.error('ZIP作成中にエラー:', error);
      alert('ZIP作成中にエラーが発生しました。');
    }
  }

  /**
   * Blobをファイルとしてダウンロード
   * @param {Blob} blob - ダウンロード対象のBlob
   * @param {string} filename - ファイル名
   */
  downloadBlob(blob, filename) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // クリーンアップ
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * 個別画像をダウンロード（フォールバック用）
   */
  downloadIndividualImages() {
    const images = this.imageGenerator.getGeneratedImages();
    
    if (images.length === 0) {
      alert('ダウンロードする画像がありません。');
      return;
    }

    images.forEach((img, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = img.data;
        link.download = img.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 200); // 200msの間隔を開ける
    });
  }
}
