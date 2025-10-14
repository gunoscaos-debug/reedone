export interface StudentAnalysisData {
  id: string;
  name: string;
  nisn: string;
  averageGrade?: number;
  bestSubject?: string;
  needImprovement?: string;
}

export interface ClassAnalysisData {
  id: string;
  className: string;
  classAverage?: number;
  studentCount?: number;
  bestSubject?: string;
  worstSubject?: string;
}

export interface SubjectAnalysisData {
  id: string;
  subjectName: string;
  averageGrade?: number;
  passRate?: number;
  studentCount?: number;
}

export interface TeacherAnalysisData {
  id: string;
  teacherName: string;
  subjectCount?: number;
  classCount?: number;
  studentAverageGrade?: number;
}

export type AnalysisData = StudentAnalysisData | ClassAnalysisData | SubjectAnalysisData | TeacherAnalysisData;
