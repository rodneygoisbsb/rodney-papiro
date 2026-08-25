package com.papiro.backend.config;

import com.papiro.backend.enums.StudyEnums.*;
import com.papiro.backend.models.*;
import com.papiro.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final StudyPlanRepository studyPlanRepository;
    private final SubjectRepository subjectRepository;
    private final TopicRepository topicRepository;
    private final DailyGoalRepository dailyGoalRepository;

    @Override
    public void run(String... args) {
        if (studyPlanRepository.count() > 0) return;

        // 1. Criar Plano de Concurso
        StudyPlan plan = StudyPlan.builder()
                .title("Plano PM-DF Oficial")
                .planType(PlanType.WEEKLY_SCHEDULE)
                .build();
        studyPlanRepository.save(plan);

        // 2. Disciplina: Direito Constitucional
        Subject constSubject = Subject.builder()
                .name("Direito Constitucional")
                .colorHex("#6366F1")
                .weight(4)
                .knowledgeLevel(3)
                .studyPlan(plan)
                .build();
        subjectRepository.save(constSubject);

        // 3. Tópicos do Edital Verticalizado
        Topic topic1 = Topic.builder()
                .name("Direitos e Garantias Fundamentais (Art. 5º)")
                .importance(ImportanceLevel.VERY_HIGH)
                .status(TopicStatus.IN_PROGRESS)
                .subject(constSubject)
                .tecQuestionsUrl("https://www.tecconcursos.com.br")
                .build();
        topicRepository.save(topic1);

        Topic topic2 = Topic.builder()
                .name("Organização do Estado e dos Poderes")
                .importance(ImportanceLevel.HIGH)
                .status(TopicStatus.NOT_STARTED)
                .subject(constSubject)
                .build();
        topicRepository.save(topic2);

        // 4. Meta de Estudo de Hoje
        DailyGoal goal = DailyGoal.builder()
                .topic(topic1)
                .scheduledDate(LocalDate.now())
                .type(StudyType.THEORY)
                .targetDurationMinutes(90)
                .completed(false)
                .build();
        dailyGoalRepository.save(goal);
    }
}