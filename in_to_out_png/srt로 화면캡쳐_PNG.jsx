//$.evalFile("/Users/thecoo/n8n-javascript/Premiere.jsx");
//var presetPath = "/Users/thecoo/n8n-javascript/epr_test.epr"; 
//$._PPP_.exportCurrentFrameAsPNG(presetPath);

/*
이 스크립트의 주요 기능:
1. SRT 파일을 선택하고 읽어들입니다.
2. SRT 파일의 내용을 파싱하여 자막 정보(인덱스, 시작 시간, 종료 시간, 텍스트)를 추출합니다.
3. 활성화된 Premiere Pro 시퀀스에서 각 자막에 대한 PNG 이미지를 생성합니다.
4. 자막의 시작 시간에 따라 플레이어의 위치를 설정하고 해당 프레임을 PNG로 내보냅니다.
5. 생성된 PNG 이미지는 사용자가 선택한 폴더에 저장됩니다.
6. 최대 5개의 자막에 대해 이미지를 생성합니다.
7. 각 단계에서 발생할 수 있는 오류를 처리하여 사용자에게 알림을 제공합니다.
8. 모든 자막 처리가 완료되면 처리된 자막의 수를 사용자에게 알립니다.

주의사항:
- 이 스크립트는 Adobe Premiere Pro에서 실행되어야 합니다.
- 실행 전 활성화된 시퀀스가 있어야 합니다.
- SRT 파일 형식이 올바르지 않으면 정상적으로 작동하지 않을 수 있습니다.
*/

// SRT 파일을 읽고 파싱하는 함수
function parseSRT(filePath) {
    var file = new File(filePath);
    file.open("r");
    var content = file.read();
    file.close();

    var subtitles = [];
    var regex = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g;
    var match;

    while ((match = regex.exec(content)) !== null) {
        subtitles.push({
            index: parseInt(match[1]),
            startTime: match[2],
            endTime: match[3],
            text: match[4].replace(/\n/g, ' ')
        });
    }

    return subtitles;
}

// 시간 문자열을 프레임으로 변환하는 함수
function timeToFrames(timeStr, fps) {
    timeStr = timeStr.replace(',', '.');
    var parts = timeStr.split(/[:.]/);
    if (parts.length !== 4) {
        alert("시간 형식 오류: " + timeStr);
        return NaN; // 잘못된 형식일 경우 NaN 반환
    }
    
    var hours = parseInt(parts[0]);
    var minutes = parseInt(parts[1]);
    var seconds = parseInt(parts[2]);
    var milliseconds = parseFloat(parts[3]); // 밀리초는 소수로 처리
    return Math.round((hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) * fps);
}

// 메인 함수
function captureSubtitles() {
    app.enableQE();
    var activeSequence = qe.project.getActiveSequence();
    var srtFile = File.openDialog("SRT 파일을 선택하세요.");
    if (!srtFile) return;

    var outputFolder = Folder.selectDialog("이미지를 저장할 폴더를 선택하세요.");
    if (!outputFolder) return;
    
    var project = app.project;
    var sequence = project.activeSequence;

    if (!sequence) {
        alert("활성 시퀀스가 없습니다.");
        return;
    }

    // FPS 값을 계산
    var settings = sequence.getSettings();
    var fps = 1 / settings.videoFrameRate.seconds; // FPS 계산
    //alert("FPS 값: " + fps); // FPS 값을 출력하여 확인

    var subtitles = parseSRT(srtFile.fsName);

    for (var i = 0; i < Math.min(5, subtitles.length); i++) {
        var subtitle = subtitles[i];
        var frame = timeToFrames(subtitle.startTime, fps); // fps를 사용하여 프레임 계산
        // 프레임 위치 설정
        if (isNaN(frame) || frame < 0) {
            alert("프레임 변환 오류: " + subtitle.startTime);
            return;
        }
        
        
        var ticksPerSecond = 254016000000; // Premiere Pro's default ticks per second
        var position = (frame / fps) * ticksPerSecond; // Move to 5 seconds

        try {
            sequence.setPlayerPosition(position.toString());
        } catch (e) {
            alert("setPlayerPosition 오류: " + e.message + " (프레임: " + frame + ")");
            return;
        }

        // Set the current time as the In and Out pointvar sequence = app.project.activeSequence;
        sequence.setInPoint(sequence.getPlayerPosition());
        sequence.setOutPoint(sequence.getPlayerPosition() + 1);  // 1 frame

        
        // 이미지 파일 경로 설정
        var outputFile = new File(outputFolder.fsName + "/Subtitle_" + padNumber(i + 1, 3) + ".png").fsName;
        
        // 프레임을 PNG로 내보내기
        try {
            //sequence.exportFrameAsPNG(frame, outputFile.fsName);
            //$._PPP_.exportCurrentFrameAsPNG(outputFile.fsName);
            // Export using Adobe Media Encoder
            //app.encoder.encodeSequence(sequence, outputFile.fsName, "PNG", 1, False);
            activeSequence.exportFramePNG(activeSequence.CTI.timecode, outputFile);
        } catch (e) {
            alert("exportFrameAsPNG 오류: " + e.message + " (프레임: " + frame + ", 파일: " + outputFile.fsName + ")");
            return;
        }
        //outputFile.close();

    }

    alert("처리가 완료되었습니다. " + subtitles.length + "개의 이미지가 저장되었습니다.");
}

// 숫자를 지정된 자릿수의 문자열로 변환 (예: 1 -> "001")
function padNumber(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // 원래 숫자를 문자열로 반환
}

captureSubtitles(); // 메인 함수 호출
