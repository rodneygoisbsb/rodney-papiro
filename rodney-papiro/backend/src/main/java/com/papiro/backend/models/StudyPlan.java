package com.papiro.backend.models;

import com.papiro.backend.enums.StudyEnums.PlanType;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "study_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title; // Ex: Plano PM-DF, Plano Banco do Brasil

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PlanType planType = PlanType.WEEKLY_SCHEDULE;

    @OneToMany(mappedBy = "studyPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subject> subjects;
}