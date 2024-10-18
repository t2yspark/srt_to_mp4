Please note that there are several ways to export PNGs, and I am not sure which method you have tried. For example, the code below would export a PNG to your desktop using the unofficial QE API:

app.enableQE();
var activeSequence = qe.project.getActiveSequence();
var outputPath = new File("~/Desktop/YourFile.png").fsName;
activeSequence.exportFramePNG(activeSequence.CTI.timecode, outputPath);

Vakago 에서 제안한 코드로 해결 --- 이렇게 간단하게?

이것으로 만든 샘플 이미지 파일을 5개만 올립니다.
애펙에서 만든것과 동일하게 잘 출력 되었슴을 확인할 수 있습니다.
같은 이미지가 겹쳐 생성된 것을 볼 수 있습니다. 
프레임 간격을 길게 하면 자막프레임을 누락할 수 있기 때문에 자막을 생성할 때 
되도록 간격을 짧게 해주어 빠지는 자막이 없게 했더니 같이 자막이 더러 생기게 됩니다.

간격을 너무 짧게 하면 처리해야 할 이미지 파일의 수가 너무 많이 늘어나서 
후처리(OCR)에 시간이 과중하게 늘어 날 가능성이 크고 너무 넓게 하면
놓치는 자막이 많아 질 수 있으므로 적당히 조절해서 자막을 생성해 주어야 합니다.

(자막이 이중으로 나옴. 자막트랙을 숨기고 출력 했어야 했는데...)
