Please note that there are several ways to export PNGs, and I am not sure which method you have tried. For example, the code below would export a PNG to your desktop using the unofficial QE API:

app.enableQE();
var activeSequence = qe.project.getActiveSequence();
var outputPath = new File("~/Desktop/YourFile.png").fsName;
activeSequence.exportFramePNG(activeSequence.CTI.timecode, outputPath);

Vakago 에서 제안한 코드로 해결 --- 이렇게 간단하게?

이것으로 만든 샘플 이미지 파일을 5개만 올립니다.
애펙에서 만든것과 동일하게 잘 출력 되었슴을 확인할 수 있습니다.

(자막이 이중으로 나옴. 자막트랙을 숨기고 출력 했어야 했는데...)
