package com.papiro.backend.dtos;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DashboardMetricsDTO {
    private int weeklyTargetHours;
    private int weeklyCompletedHours;
    private int weeklyQuestionsTotal;
    private int weeklyQuestionsCorrect;
    private double weeklyAccuracyPercentage;
    private int todayMinutesStudied;
    private int todayQuestionsDone;
    private List<DailyGoalResponseDTO> todayGoals;
}