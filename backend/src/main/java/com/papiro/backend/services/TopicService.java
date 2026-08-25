package com.papiro.backend.services;

import com.papiro.backend.dtos.CompleteTopicDTO;
import com.papiro.backend.enums.StudyEnums.*;
import com.papiro.backend.models.*;
import com.papiro.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final DailyGoalRepository dailyGoalRepository;
    private final SubjectRepository subjectRepository;

    @Transactional
    public Topic completeTopic(String topicId, CompleteTopicDTO dto) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Tópico não encontrado: " + topicId));

        Subject subject = topic.getSubject();

        // 1. Atualizar status, anotações e resumo do Tópico
        topic.setStatus(TopicStatus.COMPLETED);
        topic.setTheoryCompleted(true);
        topic.setLastStudiedAt(LocalDateTime.now());

        if (dto.getErrorNotebookNotes() != null) {
            topic.setErrorNotebookNotes(dto.getErrorNotebookNotes());
        }
        if (dto.getSummaryNotes() != null) {
            topic.setSummaryNotes(dto.getSummaryNotes());
        }

        // 2. Registrar a meta concluída de hoje
        DailyGoal todayGoal = DailyGoal.builder()
                .topic(topic)
                .scheduledDate(LocalDate.now())
                .type(StudyType.THEORY)
                .actualDurationMinutes(dto.getActualDurationMinutes())
                .questionsTotal(dto.getQuestionsTotal())
                .questionsCorrect(dto.getQuestionsCorrect())
                .studyMethod(dto.getStudyMethod())
                .completed(true)
                .build();
        dailyGoalRepository.save(todayGoal);

        // 3. Agendar apenas as revisões que o usuário selecionou nos checkboxes
        if (dto.getSelectedIntervalDays() != null && !dto.getSelectedIntervalDays().isEmpty()) {
            LocalDate today = LocalDate.now();

            for (Integer days : dto.getSelectedIntervalDays()) {
                DailyGoal revGoal = DailyGoal.builder()
                        .topic(topic)
                        .scheduledDate(today.plusDays(days))
                        .type(StudyType.REVISION)
                        .targetDurationMinutes(30)
                        .completed(false)
                        .build();
                dailyGoalRepository.save(revGoal);
            }
        }

        // 4. Revisão em Bloco (Disparada a cada 3 tópicos concluídos)
        if (dto.isScheduleBlockRevision() && subject != null) {
            int currentCount = subject.getCompletedTopicsBlockCount() + 1;

            if (currentCount >= 3) {
                // Injeta uma meta de revisão de bloco geral para o próximo dia
                DailyGoal blockGoal = DailyGoal.builder()
                        .topic(topic)
                        .scheduledDate(LocalDate.now().plusDays(1))
                        .type(StudyType.QUESTIONS)
                        .targetDurationMinutes(60)
                        .completed(false)
                        .build();
                dailyGoalRepository.save(blockGoal);
                subject.setCompletedTopicsBlockCount(0); // Zera o contador do bloco
            } else {
                subject.setCompletedTopicsBlockCount(currentCount);
            }
            subjectRepository.save(subject);
        }

        return topicRepository.save(topic);
    }
}