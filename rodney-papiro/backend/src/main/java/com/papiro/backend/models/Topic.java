package com.papiro.backend.models;

import com.papiro.backend.enums.StudyEnums.*;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "topics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TopicStatus status = TopicStatus.NOT_STARTED;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ImportanceLevel importance = ImportanceLevel.MODERATE;

    // Checks estilo Notion
    private boolean theoryCompleted;
    private boolean rev1Completed;
    private boolean rev2Completed;
    private boolean rev3Completed;
    private boolean rev4Completed;
    private boolean rev5Completed;
    private boolean rev6Completed;

    // Links de apoio
    private String tecQuestionsUrl;
    private String videoLessonUrl;
    private String pdfMaterialUrl;

    // Anotações e Caderno de erros
    @Column(columnDefinition = "TEXT")
    private String errorNotebookNotes;

    @Column(columnDefinition = "TEXT")
    private String summaryNotes;

    private LocalDateTime lastStudiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;
}