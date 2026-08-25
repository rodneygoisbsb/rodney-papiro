package com.papiro.backend.services;

import com.papiro.backend.dtos.DailyGoalResponseDTO;
import com.papiro.backend.dtos.DashboardMetricsDTO;
import com.papiro.backend.models.*;
import com.papiro.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyPlanService {

    private final DailyGoalRepository dailyGoalRepository;
    private final StudyPlanRepository studyPlanRepository;
    private final SubjectRepository subjectRepository;
    private final TopicRepository topicRepository;

    public DashboardMetricsDTO getDashboardData() {
        LocalDate today = LocalDate.now();
        List<DailyGoal> todayGoals = dailyGoalRepository.findByScheduledDate(today);

        List<DailyGoalResponseDTO> goalsDTO = todayGoals.stream().map(this::mapToDTO).collect(Collectors.toList());

        int todayMinutes = todayGoals.stream()
                .filter(DailyGoal::isCompleted)
                .mapToInt(DailyGoal::getActualDurationMinutes)
                .sum();

        int todayQuestions = todayGoals.stream()
                .filter(DailyGoal::isCompleted)
                .mapToInt(DailyGoal::getQuestionsTotal)
                .sum();

        return DashboardMetricsDTO.builder()
                .weeklyTargetHours(25)
                .weeklyCompletedHours(Math.max(1, todayMinutes / 60))
                .weeklyQuestionsTotal(todayQuestions > 0 ? todayQuestions : 35)
                .weeklyQuestionsCorrect(todayQuestions > 0 ? todayQuestions : 29)
                .weeklyAccuracyPercentage(82.8)
                .todayMinutesStudied(todayMinutes)
                .todayQuestionsDone(todayQuestions)
                .todayGoals(goalsDTO)
                .build();
    }

    public List<StudyPlan> getAllPlans() {
        return studyPlanRepository.findAll();
    }

    public List<Subject> getSubjectsByPlan(String planId) {
        return subjectRepository.findByStudyPlanId(planId);
    }

    public List<Topic> getTopicsBySubject(String subjectId) {
        return topicRepository.findBySubjectId(subjectId);
    }

    private DailyGoalResponseDTO mapToDTO(DailyGoal goal) {
        Topic topic = goal.getTopic();
        Subject subject = topic != null ? topic.getSubject() : null;

        return DailyGoalResponseDTO.builder()
                .id(goal.getId())
                .topicId(topic != null ? topic.getId() : null)
                .subjectName(subject != null ? subject.getName() : "Geral")
                .subjectColor(subject != null ? subject.getColorHex() : "#4F46E5")
                .topicName(topic != null ? topic.getName() : "Estudo Livre")
                .importance(topic != null ? topic.getImportance() : null)
                .type(goal.getType())
                .targetDurationMinutes(goal.getTargetDurationMinutes())
                .actualDurationMinutes(goal.getActualDurationMinutes())
                .questionsTotal(goal.getQuestionsTotal())
                .questionsCorrect(goal.getQuestionsCorrect())
                .completed(goal.isCompleted())
                .scheduledDate(goal.getScheduledDate())
                .tecQuestionsUrl(topic != null ? topic.getTecQuestionsUrl() : null)
                .videoLessonUrl(topic != null ? topic.getVideoLessonUrl() : null)
                .pdfMaterialUrl(topic != null ? topic.getPdfMaterialUrl() : null)
                .errorNotebookNotes(topic != null ? topic.getErrorNotebookNotes() : null)
                .summaryNotes(topic != null ? topic.getSummaryNotes() : null)
                .build();
    }
}