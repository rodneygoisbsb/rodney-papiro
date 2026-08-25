package com.papiro.backend.dtos;

import lombok.Data;
import java.util.List;

@Data
public class CompleteTopicDTO {
    // Lista com os dias escolhidos nos checkboxes (ex: [1, 7, 30])
    private List<Integer> selectedIntervalDays;

    private boolean scheduleBlockRevision;   // Revisão em bloco (a cada 3 tópicos)
    private int actualDurationMinutes;       // Minutos estudados (cronômetro ou manual)
    private int questionsTotal;              // Total de questões feitas
    private int questionsCorrect;            // Total de acertos
    private String studyMethod;              // PDF, Videoaula, Questões, Lei Seca, etc.
    private String errorNotebookNotes;       // Caderno de erros
    private String summaryNotes;             // Resumo da matéria
}