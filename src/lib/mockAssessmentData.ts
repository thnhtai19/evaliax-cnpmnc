// Mock data for testing
export interface Criteria {
  criteriaId: number;
  criteriaName: string;
  description: string;
  weight: number;
  category: string;
}

export interface CriteriaScore {
  criteria: Criteria;
  score: number;
  comment: string;
}

export interface Supervisor {
  id: number;
  name: string;
  email: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
}

export interface Assessment {
  assessmentId: number;
  supervisor: Supervisor;
  employee: Employee;
  status: string;
  totalScore: number;
  criteriaScores: CriteriaScore[];
  createdAt: string;
}

export interface AssessmentResponse {
  message: string;
  status: number;
  data: Assessment[];
}

export const mockAssessmentData: AssessmentResponse = {
  message: "Success",
  status: 200,
  data: [
    {
      assessmentId: 12,
      supervisor: {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@company.com",
      },
      employee: {
        id: 45,
        name: "Bob Smith",
        email: "bob.smith@company.com",
      },
      status: "InProgress",
      totalScore: 90.45,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 80,
          comment: "Excellent teamwork and initiative.",
        },
        {
          criteria: {
            criteriaId: 8,
            criteriaName: "Communication",
            description: "Effective verbal and written communication skills.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 90,
          comment: "Good technical skills but needs improvement in documentation.",
        },
        {
          criteria: {
            criteriaId: 9,
            criteriaName: "Leadership",
            description: "Ability to lead and inspire team members.",
            weight: 4,
            category: "SOFTSKILL",
          },
          score: 90,
          comment: "Outstanding leadership during project delivery.",
        },
      ],
      createdAt: "2025-11-01T03:45:00Z",
    },
    {
      assessmentId: 13,
      supervisor: {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@company.com",
      },
      employee: {
        id: 46,
        name: "Nguyễn Văn A",
        email: "nguyen.van.a@company.com",
      },
      status: "Completed",
      totalScore: 85.75,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 85,
          comment: "Shows good analytical thinking and problem-solving abilities.",
        },
        {
          criteria: {
            criteriaId: 10,
            criteriaName: "Technical Skills",
            description: "Proficiency in required technical tools and technologies.",
            weight: 5,
            category: "HARDSKILL",
          },
          score: 90,
          comment: "Very strong technical foundation, constantly learning new technologies.",
        },
        {
          criteria: {
            criteriaId: 11,
            criteriaName: "Time Management",
            description: "Ability to manage time effectively and meet deadlines.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 75,
          comment: "Sometimes needs better prioritization of tasks.",
        },
      ],
      createdAt: "2025-10-28T10:30:00Z",
    },
    {
      assessmentId: 14,
      supervisor: {
        id: 4,
        name: "David Lee",
        email: "david.lee@company.com",
      },
      employee: {
        id: 47,
        name: "Trần Thị B",
        email: "tran.thi.b@company.com",
      },
      status: "Pending",
      totalScore: 78.5,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 75,
          comment: "Adequate problem-solving skills, could benefit from more experience.",
        },
        {
          criteria: {
            criteriaId: 12,
            criteriaName: "Collaboration",
            description: "Ability to work effectively in team environments.",
            weight: 3,
            category: "SOFTSKILL",
          },
          score: 85,
          comment: "Great team player, always willing to help colleagues.",
        },
        {
          criteria: {
            criteriaId: 8,
            criteriaName: "Communication",
            description: "Effective verbal and written communication skills.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 80,
          comment: "Clear and professional communication style.",
        },
      ],
      createdAt: "2025-10-25T14:20:00Z",
    },
    {
      assessmentId: 15,
      supervisor: {
        id: 5,
        name: "Sarah Williams",
        email: "sarah.williams@company.com",
      },
      employee: {
        id: 48,
        name: "Lê Văn C",
        email: "le.van.c@company.com",
      },
      status: "Completed",
      totalScore: 92.3,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 10,
            criteriaName: "Technical Skills",
            description: "Proficiency in required technical tools and technologies.",
            weight: 5,
            category: "HARDSKILL",
          },
          score: 95,
          comment: "Exceptional technical expertise, mentor to junior developers.",
        },
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 90,
          comment: "Excellent at debugging complex issues quickly.",
        },
        {
          criteria: {
            criteriaId: 13,
            criteriaName: "Innovation",
            description: "Ability to suggest and implement creative solutions.",
            weight: 2,
            category: "HARDSKILL",
          },
          score: 88,
          comment: "Brings fresh perspectives to challenging problems.",
        },
      ],
      createdAt: "2025-10-30T09:15:00Z",
    },
    {
      assessmentId: 16,
      supervisor: {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@company.com",
      },
      employee: {
        id: 49,
        name: "Phạm Thị D",
        email: "pham.thi.d@company.com",
      },
      status: "Draft",
      totalScore: 70.25,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 11,
            criteriaName: "Time Management",
            description: "Ability to manage time effectively and meet deadlines.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 65,
          comment: "Needs improvement in meeting project deadlines consistently.",
        },
        {
          criteria: {
            criteriaId: 8,
            criteriaName: "Communication",
            description: "Effective verbal and written communication skills.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 70,
          comment: "Basic communication skills, room for improvement.",
        },
        {
          criteria: {
            criteriaId: 12,
            criteriaName: "Collaboration",
            description: "Ability to work effectively in team environments.",
            weight: 3,
            category: "SOFTSKILL",
          },
          score: 75,
          comment: "Works well independently but could engage more with team.",
        },
      ],
      createdAt: "2025-11-02T16:45:00Z",
    },
    {
      assessmentId: 17,
      supervisor: {
        id: 6,
        name: "Michael Chen",
        email: "michael.chen@company.com",
      },
      employee: {
        id: 50,
        name: "Hoàng Văn E",
        email: "hoang.van.e@company.com",
      },
      status: "InProgress",
      totalScore: 88.9,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 9,
            criteriaName: "Leadership",
            description: "Ability to lead and inspire team members.",
            weight: 4,
            category: "SOFTSKILL",
          },
          score: 90,
          comment: "Natural leader, takes initiative in challenging situations.",
        },
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 88,
          comment: "Strong analytical skills and systematic approach.",
        },
        {
          criteria: {
            criteriaId: 10,
            criteriaName: "Technical Skills",
            description: "Proficiency in required technical tools and technologies.",
            weight: 5,
            category: "HARDSKILL",
          },
          score: 87,
          comment: "Solid technical foundation with continuous learning mindset.",
        },
      ],
      createdAt: "2025-11-03T11:20:00Z",
    },
    {
      assessmentId: 18,
      supervisor: {
        id: 4,
        name: "David Lee",
        email: "david.lee@company.com",
      },
      employee: {
        id: 51,
        name: "Võ Thị F",
        email: "vo.thi.f@company.com",
      },
      status: "Completed",
      totalScore: 81.6,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 8,
            criteriaName: "Communication",
            description: "Effective verbal and written communication skills.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 85,
          comment: "Excellent written and verbal communication skills.",
        },
        {
          criteria: {
            criteriaId: 12,
            criteriaName: "Collaboration",
            description: "Ability to work effectively in team environments.",
            weight: 3,
            category: "SOFTSKILL",
          },
          score: 82,
          comment: "Works well in cross-functional teams.",
        },
        {
          criteria: {
            criteriaId: 11,
            criteriaName: "Time Management",
            description: "Ability to manage time effectively and meet deadlines.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 78,
          comment: "Generally good time management, occasional delays.",
        },
      ],
      createdAt: "2025-10-27T08:10:00Z",
    },
    // Thêm nhiều đánh giá cho Nguyễn Văn A (ID: 46)
    {
      assessmentId: 19,
      supervisor: {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@company.com",
      },
      employee: {
        id: 46,
        name: "Nguyễn Văn A",
        email: "nguyen.van.a@company.com",
      },
      status: "Completed",
      totalScore: 88.2,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 10,
            criteriaName: "Technical Skills",
            description: "Proficiency in required technical tools and technologies.",
            weight: 5,
            category: "HARDSKILL",
          },
          score: 92,
          comment: "Has improved significantly in technical skills since last assessment.",
        },
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 88,
          comment: "Better problem-solving approach, more systematic thinking.",
        },
        {
          criteria: {
            criteriaId: 11,
            criteriaName: "Time Management",
            description: "Ability to manage time effectively and meet deadlines.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 82,
          comment: "Improved time management, consistently meeting deadlines.",
        },
      ],
      createdAt: "2025-09-15T09:20:00Z",
    },
    {
      assessmentId: 20,
      supervisor: {
        id: 4,
        name: "David Lee",
        email: "david.lee@company.com",
      },
      employee: {
        id: 46,
        name: "Nguyễn Văn A",
        email: "nguyen.van.a@company.com",
      },
      status: "Completed",
      totalScore: 83.5,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 8,
            criteriaName: "Communication",
            description: "Effective verbal and written communication skills.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 80,
          comment: "Good communication skills in Vietnamese, improving English communication.",
        },
        {
          criteria: {
            criteriaId: 12,
            criteriaName: "Collaboration",
            description: "Ability to work effectively in team environments.",
            weight: 3,
            category: "SOFTSKILL",
          },
          score: 88,
          comment: "Excellent collaboration skills, proactive in team activities.",
        },
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 82,
          comment: "Shows improvement in analytical thinking.",
        },
      ],
      createdAt: "2025-08-20T14:30:00Z",
    },
    {
      assessmentId: 21,
      supervisor: {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@company.com",
      },
      employee: {
        id: 46,
        name: "Nguyễn Văn A",
        email: "nguyen.van.a@company.com",
      },
      status: "InProgress",
      totalScore: 87.8,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 10,
            criteriaName: "Technical Skills",
            description: "Proficiency in required technical tools and technologies.",
            weight: 5,
            category: "HARDSKILL",
          },
          score: 91,
          comment: "Mastering new technologies quickly, eager to learn.",
        },
        {
          criteria: {
            criteriaId: 9,
            criteriaName: "Leadership",
            description: "Ability to lead and inspire team members.",
            weight: 4,
            category: "SOFTSKILL",
          },
          score: 85,
          comment: "Taking on more leadership responsibilities, showing growth potential.",
        },
        {
          criteria: {
            criteriaId: 13,
            criteriaName: "Innovation",
            description: "Ability to suggest and implement creative solutions.",
            weight: 2,
            category: "HARDSKILL",
          },
          score: 85,
          comment: "Starting to contribute innovative ideas to projects.",
        },
      ],
      createdAt: "2025-11-05T10:15:00Z",
    },
    // Thêm nhiều đánh giá cho Trần Thị B (ID: 47)
    {
      assessmentId: 22,
      supervisor: {
        id: 4,
        name: "David Lee",
        email: "david.lee@company.com",
      },
      employee: {
        id: 47,
        name: "Trần Thị B",
        email: "tran.thi.b@company.com",
      },
      status: "Completed",
      totalScore: 82.4,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 8,
            criteriaName: "Communication",
            description: "Effective verbal and written communication skills.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 85,
          comment: "Clear and concise communication, excellent documentation.",
        },
        {
          criteria: {
            criteriaId: 12,
            criteriaName: "Collaboration",
            description: "Ability to work effectively in team environments.",
            weight: 3,
            category: "SOFTSKILL",
          },
          score: 88,
          comment: "Outstanding team collaboration, always supportive.",
        },
        {
          criteria: {
            criteriaId: 11,
            criteriaName: "Time Management",
            description: "Ability to manage time effectively and meet deadlines.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 75,
          comment: "Generally meets deadlines, sometimes needs better planning.",
        },
      ],
      createdAt: "2025-09-10T11:45:00Z",
    },
    {
      assessmentId: 23,
      supervisor: {
        id: 5,
        name: "Sarah Williams",
        email: "sarah.williams@company.com",
      },
      employee: {
        id: 47,
        name: "Trần Thị B",
        email: "tran.thi.b@company.com",
      },
      status: "Completed",
      totalScore: 79.8,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 78,
          comment: "Good problem-solving skills, benefits from team collaboration.",
        },
        {
          criteria: {
            criteriaId: 10,
            criteriaName: "Technical Skills",
            description: "Proficiency in required technical tools and technologies.",
            weight: 5,
            category: "HARDSKILL",
          },
          score: 82,
          comment: "Solid technical foundation, continues to learn new skills.",
        },
        {
          criteria: {
            criteriaId: 8,
            criteriaName: "Communication",
            description: "Effective verbal and written communication skills.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 83,
          comment: "Effective communicator, especially in written format.",
        },
      ],
      createdAt: "2025-08-05T13:20:00Z",
    },
    {
      assessmentId: 24,
      supervisor: {
        id: 4,
        name: "David Lee",
        email: "david.lee@company.com",
      },
      employee: {
        id: 47,
        name: "Trần Thị B",
        email: "tran.thi.b@company.com",
      },
      status: "Draft",
      totalScore: 81.6,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 12,
            criteriaName: "Collaboration",
            description: "Ability to work effectively in team environments.",
            weight: 3,
            category: "SOFTSKILL",
          },
          score: 87,
          comment: "Excellent team player, always helpful to colleagues.",
        },
        {
          criteria: {
            criteriaId: 11,
            criteriaName: "Time Management",
            description: "Ability to manage time effectively and meet deadlines.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 78,
          comment: "Improved time management compared to previous assessment.",
        },
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 80,
          comment: "Steady improvement in problem-solving capabilities.",
        },
      ],
      createdAt: "2025-11-04T15:30:00Z",
    },
    // Thêm nhiều đánh giá cho Lê Văn C (ID: 48)
    {
      assessmentId: 25,
      supervisor: {
        id: 5,
        name: "Sarah Williams",
        email: "sarah.williams@company.com",
      },
      employee: {
        id: 48,
        name: "Lê Văn C",
        email: "le.van.c@company.com",
      },
      status: "Completed",
      totalScore: 94.5,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 10,
            criteriaName: "Technical Skills",
            description: "Proficiency in required technical tools and technologies.",
            weight: 5,
            category: "HARDSKILL",
          },
          score: 98,
          comment: "Expert-level technical skills, serves as technical lead for complex projects.",
        },
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 95,
          comment: "Exceptional problem-solving abilities, quick to identify root causes.",
        },
        {
          criteria: {
            criteriaId: 13,
            criteriaName: "Innovation",
            description: "Ability to suggest and implement creative solutions.",
            weight: 2,
            category: "HARDSKILL",
          },
          score: 92,
          comment: "Consistently brings innovative solutions to complex technical challenges.",
        },
      ],
      createdAt: "2025-09-25T08:30:00Z",
    },
    {
      assessmentId: 26,
      supervisor: {
        id: 6,
        name: "Michael Chen",
        email: "michael.chen@company.com",
      },
      employee: {
        id: 48,
        name: "Lê Văn C",
        email: "le.van.c@company.com",
      },
      status: "Completed",
      totalScore: 91.2,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 10,
            criteriaName: "Technical Skills",
            description: "Proficiency in required technical tools and technologies.",
            weight: 5,
            category: "HARDSKILL",
          },
          score: 94,
          comment: "Outstanding technical expertise across multiple domains.",
        },
        {
          criteria: {
            criteriaId: 9,
            criteriaName: "Leadership",
            description: "Ability to lead and inspire team members.",
            weight: 4,
            category: "SOFTSKILL",
          },
          score: 88,
          comment: "Natural leader, mentors junior developers effectively.",
        },
        {
          criteria: {
            criteriaId: 8,
            criteriaName: "Communication",
            description: "Effective verbal and written communication skills.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 87,
          comment: "Clear technical communication, effective knowledge sharing.",
        },
      ],
      createdAt: "2025-08-12T10:00:00Z",
    },
    {
      assessmentId: 27,
      supervisor: {
        id: 5,
        name: "Sarah Williams",
        email: "sarah.williams@company.com",
      },
      employee: {
        id: 48,
        name: "Lê Văn C",
        email: "le.van.c@company.com",
      },
      status: "Completed",
      totalScore: 93.8,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 10,
            criteriaName: "Technical Skills",
            description: "Proficiency in required technical tools and technologies.",
            weight: 5,
            category: "HARDSKILL",
          },
          score: 97,
          comment: "Top-tier technical skills, recognized as subject matter expert.",
        },
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 93,
          comment: "Excellent debugging and troubleshooting capabilities.",
        },
        {
          criteria: {
            criteriaId: 12,
            criteriaName: "Collaboration",
            description: "Ability to work effectively in team environments.",
            weight: 3,
            category: "SOFTSKILL",
          },
          score: 90,
          comment: "Great collaborator, shares knowledge freely with team.",
        },
      ],
      createdAt: "2025-07-18T14:15:00Z",
    },
    // Thêm nhiều đánh giá cho Bob Smith (ID: 45)
    {
      assessmentId: 28,
      supervisor: {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@company.com",
      },
      employee: {
        id: 45,
        name: "Bob Smith",
        email: "bob.smith@company.com",
      },
      status: "Completed",
      totalScore: 89.3,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 9,
            criteriaName: "Leadership",
            description: "Ability to lead and inspire team members.",
            weight: 4,
            category: "SOFTSKILL",
          },
          score: 92,
          comment: "Strong leadership skills, team members respect and follow direction.",
        },
        {
          criteria: {
            criteriaId: 8,
            criteriaName: "Communication",
            description: "Effective verbal and written communication skills.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 88,
          comment: "Effective communicator, clear in conveying ideas.",
        },
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 86,
          comment: "Good problem-solving approach, systematic thinking.",
        },
      ],
      createdAt: "2025-09-08T09:45:00Z",
    },
    {
      assessmentId: 29,
      supervisor: {
        id: 6,
        name: "Michael Chen",
        email: "michael.chen@company.com",
      },
      employee: {
        id: 45,
        name: "Bob Smith",
        email: "bob.smith@company.com",
      },
      status: "Completed",
      totalScore: 87.6,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 10,
            criteriaName: "Technical Skills",
            description: "Proficiency in required technical tools and technologies.",
            weight: 5,
            category: "HARDSKILL",
          },
          score: 88,
          comment: "Solid technical skills, continuously updating knowledge.",
        },
        {
          criteria: {
            criteriaId: 12,
            criteriaName: "Collaboration",
            description: "Ability to work effectively in team environments.",
            weight: 3,
            category: "SOFTSKILL",
          },
          score: 89,
          comment: "Excellent team player, contributes positively to team dynamics.",
        },
        {
          criteria: {
            criteriaId: 11,
            criteriaName: "Time Management",
            description: "Ability to manage time effectively and meet deadlines.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 85,
          comment: "Good time management, consistently delivers on time.",
        },
      ],
      createdAt: "2025-08-15T16:20:00Z",
    },
    {
      assessmentId: 30,
      supervisor: {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@company.com",
      },
      employee: {
        id: 45,
        name: "Bob Smith",
        email: "bob.smith@company.com",
      },
      status: "Draft",
      totalScore: 91.5,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 9,
            criteriaName: "Leadership",
            description: "Ability to lead and inspire team members.",
            weight: 4,
            category: "SOFTSKILL",
          },
          score: 93,
          comment: "Leadership skills have improved significantly, taking on more responsibilities.",
        },
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 90,
          comment: "Enhanced problem-solving capabilities, more strategic approach.",
        },
        {
          criteria: {
            criteriaId: 13,
            criteriaName: "Innovation",
            description: "Ability to suggest and implement creative solutions.",
            weight: 2,
            category: "HARDSKILL",
          },
          score: 90,
          comment: "Brings innovative ideas to projects, creative problem-solver.",
        },
      ],
      createdAt: "2025-11-06T11:30:00Z",
    },
  ],
};
