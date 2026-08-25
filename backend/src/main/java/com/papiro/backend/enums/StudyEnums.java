package com.papiro.backend.enums;

public class StudyEnums {
    public enum TopicStatus {
        NOT_STARTED, IN_PROGRESS, COMPLETED, IN_REVISION
    }

    public enum StudyType {
        THEORY, QUESTIONS, REVISION, SIMULATED
    }

    public enum ImportanceLevel {
        VERY_HIGH, HIGH, MODERATE, LOW
    }

    public enum PlanType {
        WEEKLY_SCHEDULE, STUDY_CYCLE
    }
}