import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { interviewService } from "@/services/api";

const InterviewQuestions = () => {
  const { jobId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState(null);

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const result = await interviewService.generateQuestions(jobId);
      setQuestions(result.assessment);
      toast.success("Interview questions generated successfully!");
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate interview questions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Interview Questions Generator</h1>
          <Button 
            onClick={generateQuestions} 
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Questions"}
          </Button>
        </div>

        {questions && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">{questions.title}</h2>
              <p className="text-gray-600 mb-4">{questions.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="font-medium">Skill:</span> {questions.skill}
                </div>
                <div>
                  <span className="font-medium">Level:</span> {questions.level}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {questions.duration} minutes
                </div>
                <div>
                  <span className="font-medium">Passing Score:</span> {questions.passingScore}%
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              {questions.questions.map((question, index) => (
                <Card key={index} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium">Question {index + 1}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      question.type === 'technical' ? 'bg-blue-100 text-blue-800' :
                      question.type === 'behavioral' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {question.type}
                    </span>
                  </div>
                  <p className="mb-4">{question.question}</p>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Evaluation Criteria:</h4>
                    <p className="text-gray-700">{question.explanation}</p>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-600">
                    <span>Points: {question.points}</span>
                    <span>Level: {question.level}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestions; 