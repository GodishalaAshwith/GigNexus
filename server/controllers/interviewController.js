const geminiService = require('../services/geminiService');
const SkillAssessment = require('../models/SkillAssessment');

exports.generateInterviewQuestions = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const questions = await geminiService.generateInterviewQuestions({
      title: job.title,
      description: job.description,
      skills: job.skills,
      experienceLevel: job.experienceLevel
    });

    // Create a new skill assessment
    const assessment = new SkillAssessment({
      title: `Interview Questions for ${job.title}`,
      description: `Auto-generated interview questions for ${job.title} position`,
      skill: job.skills[0], // Primary skill
      level: job.experienceLevel.toLowerCase(),
      type: 'interview',
      duration: 60, // Default 60 minutes
      questions: questions.map(q => ({
        type: q.type === 'technical' ? 'multiple-choice' : 'text',
        question: q.question,
        points: q.points,
        explanation: q.explanation,
        options: q.options
      })),
      passingScore: 70, // Default passing score
      createdBy: req.user.id
    });

    await assessment.save();

    res.json({
      success: true,
      assessment: assessment
    });
  } catch (error) {
    console.error('Error generating interview questions:', error);
    res.status(500).json({ message: 'Error generating interview questions' });
  }
}; 