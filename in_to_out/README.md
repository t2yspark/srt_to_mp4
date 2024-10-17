만들어진 mp4 파일들이 이 폴더에 있습니다.
방금 extendscript를 만든 Vakago로 부터 답변이 있었는데
PNG파일로 출력하는게 가능하답니다.

Vakago Support <info@vakago.de>
오후 3:56 (2시간 전)
나에게

Hi Sunny,

Thank you for reaching out. Did you refer to the official code examples for exporting PNGs? Exporting PNGs using the extension should be easily possible. In fact, our automated tests for this extension include exporting the current frame as PNG and importing it, and this works well even in the latest version.

Please note that there are several ways to export PNGs, and I am not sure which method you have tried. For example, the code below would export a PNG to your desktop using the unofficial QE API:

app.enableQE();
var activeSequence = qe.project.getActiveSequence();
var outputPath = new File("~/Desktop/YourFile.png").fsName;
activeSequence.exportFramePNG(activeSequence.CTI.timecode, outputPath);

다시 해보겠슴 ㅎ
