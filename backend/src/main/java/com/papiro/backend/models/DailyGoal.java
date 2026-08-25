package com.papiro.backend.models;

import com.papiro.backend.enums.StudyEnums.StudyType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private LocalDate scheduledDate;

    @Enumerated(EnumType.STRING)
    private StudyType type;

    private int targetDurationMinutes;
    private int actualDurationMinutes;

    private int questionsTotal;
    private int questionsCorrect;

    private String studyMethod; // Guarda se foi PDF, Videoaula, Questões...

    private boolean completed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;
}