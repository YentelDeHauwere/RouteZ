// Exercise
import {
  default as mongoose,
  Document,
  Schema,
} from 'mongoose';

interface IExercise extends Document {
  question: string;
  multiple: boolean;
  answers: [{
    text: string;
    correct: boolean;
  }];
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;
};

const exerciseSchema : Schema = new Schema({
  question: {
    type: String,
    required: true,
    unique: false,
  },
  multiple: {
    type: Boolean,
    unique: false,
    required: true,
  },
  answers: [
    {
      text: {
        type: String,
        unique: false,
        required: true,
      },
      correct: {
        type: Boolean,
        unique: false,
        required: true,
      },
    },
  ],
  _createdAt: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  _modifiedAt: {
      type: Number,
      required: false,
      default: null,
  },
  _deletedAt: {
      type: Number,
      required: false,
      default: null,       
  },
});

const Exercise = mongoose.model<IExercise>('Exercise', exerciseSchema);

export {
  Exercise,
  exerciseSchema,
  IExercise,
};
