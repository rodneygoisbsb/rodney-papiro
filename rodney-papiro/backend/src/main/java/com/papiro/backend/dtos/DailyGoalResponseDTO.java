package com.papiro.backend.dtos;

import com.papiro.backend.enums.StudyEnums.*;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class DailyGoalResponseDTO {
    private String id;
    private String topicId;
    private String subjectName;
    private String subjectColor;
    private String topicName;
    private ImportanceLevel importance;
    private StudyType type;
    private int targetDurationMinutes;
    private int actualDurationMinutes;
    private int questionsTotal;
    private int questionsCorrect;
    private boolean completed;
    private LocalDate scheduledDate;
    private String tecQuestionsUrl;
    private String videoLessonUrl;
    private String pdfMaterialUrl;
    private String errorNotebookNotes;
    private String summaryNotes;
}