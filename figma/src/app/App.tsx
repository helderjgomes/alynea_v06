import { useState } from 'react';
import { Calendar, Columns3 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { InboxView } from './components/InboxView';
import { TodayView } from './components/TodayView';
import { TaskEditor } from './components/TaskEditor';
import { WeekView } from './components/WeekView';
import { WeekPlanView } from './components/WeekPlanView';
import { ProjectsView } from './components/ProjectsView';
import { GoalsView } from './components/GoalsView';
import { HabitsView } from './components/HabitsView';
import { GoalEditor } from './components/GoalEditor';
import { HabitEditor } from './components/HabitEditor';
import { TimeblockEditor } from './components/TimeblockEditor';
import { FilterEditor } from './components/FilterEditor';
import { SettingsPanel } from './components/SettingsPanel';

type View = 'inbox' | 'today' | 'upcoming' | 'weekplan' | 'projects' | 'goals' | 'habits';
type PlanningViewMode = 'calendar' | 'kanban';

interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: string;
  project?: string;
  section?: string;
  priority?: 'low' | 'medium' | 'high';
  startTime?: string;
  endTime?: string;
  duration?: string;
}

interface Section {
  id: string;
  name: string;
  project: string;
  order: number;
}

interface LifeArea {
  id: string;
  name: string;
  color: string;
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  metricType?: 'binary' | 'numeric';
  currentValue?: number;
  targetValue?: number;
  status?: 'on_track' | 'at_risk' | 'off_track' | 'completed';
  timeframe?: string;
  timeframeType?: 'this_week' | 'this_month' | 'this_quarter' | 'this_year' | 'ongoing' | 'custom';
  area?: string; // Life Area ID
  parentGoal?: string; // Parent Goal ID
  progress?: string; // Deprecated, use currentValue/targetValue
}

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency?: string;
  frequencyType?: 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom';
  customDays?: boolean[]; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  targetAmount?: number;
  targetUnit?: string;
  targetPeriod?: 'day' | 'week' | 'month';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  relatedGoal?: string; // Goal ID
  area?: string; // Life Area ID
  color?: string;
  icon?: string;
  isPaused?: boolean;
  pausedDate?: string;
  completedToday?: boolean;
  isActiveToday?: boolean;
  checkIns?: CheckIn[];
}

interface CheckIn {
  id: string;
  habitId: string;
  date: string;
  amount: number;
  completed: boolean;
}

interface Timeblock {
  id: string;
  label?: string;
  startTime: string; // ISO timestamp or time string
  endTime: string;
  date: string; // YYYY-MM-DD
  color: string;
  taskIds: string[]; // Tasks associated with this block
  isLocked?: boolean; // Won't move with auto-scheduling
  isExternal?: boolean; // From external calendar
  externalSource?: 'google' | 'outlook' | 'apple';
}

interface FilterCondition {
  type: 'project' | 'priority' | 'dueDate' | 'status' | 'labels' | 'hasSubtasks' | 'created';
  values: string[];
}

interface Filter {
  id: string;
  name: string;
  color: string;
  icon?: string;
  isFavorite?: boolean;
  conditions: FilterCondition[];
  sortBy?: 'dueDate' | 'priority' | 'created' | 'alphabetical' | 'project';
  sortOrder?: 'asc' | 'desc';
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('weekplan');
  const [planningViewMode, setPlanningViewMode] = useState<PlanningViewMode>('calendar');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedTimeblock, setSelectedTimeblock] = useState<Timeblock | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);

  // Settings state
  const [todoistApiKey, setTodoistApiKey] = useState('');
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([
    { id: '1', name: 'Work', color: '#007AFF' },
    { id: '2', name: 'Family', color: '#34C759' },
    { id: '3', name: 'Health', color: '#FF9500' },
    { id: '4', name: 'Personal', color: '#AF52DE' },
    { id: '5', name: 'Home', color: '#FF2D55' },
    { id: '6', name: 'Finance', color: '#5AC8FA' },
  ]);

  const [sections, setSections] = useState<Section[]>([
    { id: 's1', name: 'Planning', project: 'Work', order: 1 },
    { id: 's2', name: 'In Progress', project: 'Work', order: 2 },
    { id: 's3', name: 'Review', project: 'Work', order: 3 },
    { id: 's4', name: 'Waiting', project: 'Work', order: 4 },
    { id: 's5', name: 'Health & Wellness', project: 'Personal', order: 1 },
    { id: 's6', name: 'Home & Errands', project: 'Personal', order: 2 },
    { id: 's7', name: 'Financial', project: 'Personal', order: 3 },
    { id: 's8', name: 'Social', project: 'Personal', order: 4 },
    { id: 's9', name: 'Content Creation', project: 'Ideas', order: 1 },
    { id: 's10', name: 'Learning', project: 'Ideas', order: 2 },
    { id: 's11', name: 'Side Projects', project: 'Ideas', order: 3 },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    // Quarter Goals
    {
      id: '1',
      title: 'Build a sustainable exercise routine',
      description: 'Establish consistent movement practice that fits into daily life',
      metricType: 'numeric',
      currentValue: 8,
      targetValue: 12,
      status: 'on_track',
      timeframe: 'Q1 2026',
      timeframeType: 'this_quarter',
      area: '3', // Health
    },
    {
      id: '1a',
      title: 'Complete 30-minute walks',
      description: 'Morning walks at least 4x per week',
      metricType: 'numeric',
      currentValue: 6,
      targetValue: 12,
      status: 'on_track',
      timeframe: 'Q1 2026',
      timeframeType: 'this_quarter',
      parentGoal: '1',
      area: '3',
    },
    {
      id: '1b',
      title: 'Try 2 new fitness activities',
      description: 'Explore yoga, swimming, or climbing',
      metricType: 'numeric',
      currentValue: 1,
      targetValue: 2,
      status: 'on_track',
      timeframe: 'Q1 2026',
      timeframeType: 'this_quarter',
      parentGoal: '1',
      area: '3',
    },
    {
      id: '4',
      title: 'Launch personal website redesign',
      description: 'Complete new portfolio with case studies',
      metricType: 'numeric',
      currentValue: 3,
      targetValue: 5,
      status: 'at_risk',
      timeframe: 'Q1 2026',
      timeframeType: 'this_quarter',
      area: '1', // Work
    },
    {
      id: '4a',
      title: 'Write 3 detailed case studies',
      description: 'Document recent projects',
      metricType: 'numeric',
      currentValue: 1,
      targetValue: 3,
      status: 'at_risk',
      timeframe: 'Q1 2026',
      timeframeType: 'this_quarter',
      parentGoal: '4',
      area: '1',
    },
    // Year Goals
    {
      id: '2',
      title: 'Deepen focus and creative work',
      description: 'Create dedicated space for meaningful project work without interruption',
      metricType: 'binary',
      currentValue: 0,
      targetValue: 1,
      status: 'on_track',
      timeframe: '2026',
      timeframeType: 'this_year',
      area: '4', // Personal
    },
    {
      id: '2a',
      title: 'Read 24 books on craft and creativity',
      description: 'Two books per month minimum',
      metricType: 'numeric',
      currentValue: 2,
      targetValue: 24,
      status: 'on_track',
      timeframe: '2026',
      timeframeType: 'this_year',
      parentGoal: '2',
      area: '4',
    },
    {
      id: '5',
      title: 'Build emergency fund',
      description: 'Save 6 months of expenses',
      metricType: 'numeric',
      currentValue: 12000,
      targetValue: 30000,
      status: 'on_track',
      timeframe: '2026',
      timeframeType: 'this_year',
      area: '6', // Finance
    },
    // Ongoing Goals
    {
      id: '3',
      title: 'Strengthen close relationships',
      description: 'Spend intentional time with people who matter most',
      metricType: 'binary',
      currentValue: 1,
      targetValue: 1,
      status: 'completed',
      timeframe: 'Ongoing',
      timeframeType: 'ongoing',
      area: '2', // Family
    },
  ]);

  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Morning walk',
      description: 'Fresh air and movement to start the day',
      frequency: 'Daily',
      frequencyType: 'daily',
      targetAmount: 30,
      targetUnit: 'minutes',
      timeOfDay: 'morning',
      relatedGoal: '1', // Exercise routine goal
      area: '3', // Health
      completedToday: false,
      isActiveToday: true,
      checkIns: [
        { id: 'c1', habitId: '1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 30, completed: true },
        { id: 'c2', habitId: '1', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 25, completed: true },
        { id: 'c3', habitId: '1', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 30, completed: true },
        { id: 'c4', habitId: '1', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 20, completed: true },
        { id: 'c5', habitId: '1', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 30, completed: true },
      ],
    },
    {
      id: '2',
      name: 'Read for learning',
      description: 'Professional development and personal growth',
      frequency: 'Daily',
      frequencyType: 'daily',
      targetAmount: 20,
      targetUnit: 'pages',
      timeOfDay: 'evening',
      relatedGoal: '2', // Focus and creative work
      area: '4', // Personal
      completedToday: true,
      isActiveToday: true,
      checkIns: [
        { id: 'c6', habitId: '2', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 20, completed: true },
        { id: 'c7', habitId: '2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 15, completed: true },
        { id: 'c8', habitId: '2', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 20, completed: true },
        { id: 'c9', habitId: '2', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 25, completed: true },
      ],
    },
    {
      id: '3',
      name: 'Meditation',
      description: 'Mindfulness and mental clarity',
      frequency: 'Daily',
      frequencyType: 'daily',
      targetAmount: 10,
      targetUnit: 'minutes',
      timeOfDay: 'morning',
      area: '3', // Health
      completedToday: false,
      isActiveToday: true,
      checkIns: [
        { id: 'c10', habitId: '3', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 10, completed: true },
        { id: 'c11', habitId: '3', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 10, completed: true },
        { id: 'c12', habitId: '3', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 10, completed: true },
      ],
    },
    {
      id: '4',
      name: 'Practice guitar',
      description: 'Learn new songs and improve technique',
      frequency: 'Mon, Wed, Fri',
      frequencyType: 'custom',
      customDays: [true, false, true, false, true, false, false],
      targetAmount: 30,
      targetUnit: 'minutes',
      timeOfDay: 'afternoon',
      area: '4', // Personal
      completedToday: false,
      isActiveToday: true,
      checkIns: [
        { id: 'c13', habitId: '4', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 30, completed: true },
        { id: 'c14', habitId: '4', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 25, completed: true },
        { id: 'c15', habitId: '4', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 30, completed: true },
      ],
    },
    {
      id: '5',
      name: 'Call family',
      description: 'Stay connected with loved ones',
      frequency: 'Weekly',
      frequencyType: 'weekly',
      timeOfDay: 'evening',
      relatedGoal: '3', // Strengthen relationships
      area: '2', // Family
      completedToday: false,
      isActiveToday: false,
      checkIns: [
        { id: 'c16', habitId: '5', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 1, completed: true },
        { id: 'c17', habitId: '5', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 1, completed: true },
      ],
    },
    {
      id: '6',
      name: 'Review weekly goals',
      description: 'Reflect and plan for the week ahead',
      frequency: 'Sundays',
      frequencyType: 'custom',
      customDays: [false, false, false, false, false, false, true],
      timeOfDay: 'evening',
      relatedGoal: '2',
      area: '4', // Personal
      completedToday: false,
      isActiveToday: false,
      checkIns: [
        { id: 'c18', habitId: '6', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 1, completed: true },
      ],
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    // Work - Planning
    {
      id: '1',
      title: 'Review quarterly roadmap',
      notes: 'Prepare presentation for team meeting',
      completed: false,
      project: 'Work',
      section: 's1',
      dueDate: 'Jan 9',
      priority: 'high',
      duration: '1h',
    },
    {
      id: '12',
      title: 'Client presentation prep',
      notes: 'Create slides and practice delivery',
      completed: false,
      project: 'Work',
      section: 's1',
      dueDate: 'Jan 11',
      priority: 'high',
      duration: '3h',
    },
    {
      id: '13',
      title: 'Draft project proposal for Q2',
      notes: 'Outline scope, timeline, and resources needed',
      completed: false,
      project: 'Work',
      section: 's1',
      dueDate: 'Jan 15',
      priority: 'medium',
      duration: '2h',
    },
    {
      id: '14',
      title: 'Schedule 1:1s with team members',
      notes: 'Book recurring monthly check-ins',
      completed: false,
      project: 'Work',
      section: 's1',
      dueDate: 'Jan 10',
      priority: 'medium',
      duration: '20m',
    },
    // Work - In Progress
    {
      id: '2',
      title: 'Update design system documentation',
      notes: 'Add new component guidelines and best practices',
      completed: false,
      project: 'Work',
      section: 's2',
      dueDate: 'Jan 10',
      priority: 'medium',
      duration: '45m',
    },
    {
      id: '3',
      title: 'Team retrospective meeting',
      notes: '',
      completed: false,
      project: 'Work',
      section: 's2',
      dueDate: 'Jan 10',
      priority: 'low',
      duration: '30m',
    },
    {
      id: '15',
      title: 'Implement user authentication flow',
      notes: 'OAuth integration with social providers',
      completed: false,
      project: 'Work',
      section: 's2',
      dueDate: 'Jan 12',
      priority: 'high',
      duration: '4h',
    },
    {
      id: '16',
      title: 'Fix responsive layout bugs',
      notes: 'Mobile view issues on dashboard',
      completed: false,
      project: 'Work',
      section: 's2',
      dueDate: 'Jan 11',
      priority: 'high',
      duration: '2h',
    },
    {
      id: '17',
      title: 'Write unit tests for API endpoints',
      notes: 'Achieve 80% coverage target',
      completed: false,
      project: 'Work',
      section: 's2',
      dueDate: 'Jan 13',
      priority: 'medium',
      duration: '3h',
    },
    // Work - Review
    {
      id: '4',
      title: 'Finalize Q1 budget proposal',
      notes: 'Review with finance team',
      completed: false,
      project: 'Work',
      section: 's3',
      dueDate: 'Jan 12',
      priority: 'high',
      duration: '2h',
    },
    {
      id: '18',
      title: 'Code review for PR #247',
      notes: 'New feature implementation from Sarah',
      completed: false,
      project: 'Work',
      section: 's3',
      dueDate: 'Jan 9',
      priority: 'medium',
      duration: '45m',
    },
    {
      id: '19',
      title: 'QA testing for release v2.3',
      notes: 'Test all critical user flows',
      completed: false,
      project: 'Work',
      section: 's3',
      dueDate: 'Jan 14',
      priority: 'high',
      duration: '2h',
    },
    // Work - Waiting
    {
      id: '20',
      title: 'Follow up on vendor contract',
      notes: 'Waiting for legal department approval',
      completed: false,
      project: 'Work',
      section: 's4',
      dueDate: 'Jan 16',
      priority: 'low',
      duration: '15m',
    },
    {
      id: '21',
      title: 'Server upgrade approval',
      notes: 'Pending DevOps team availability',
      completed: false,
      project: 'Work',
      section: 's4',
      dueDate: 'Jan 17',
      priority: 'medium',
      duration: '10m',
    },
    // Personal - Health & Wellness
    {
      id: '5',
      title: 'Schedule dentist appointment',
      notes: 'Regular checkup',
      completed: false,
      project: 'Personal',
      section: 's5',
      dueDate: 'Jan 11',
      priority: 'medium',
      duration: '15m',
    },
    {
      id: '22',
      title: 'Book annual physical exam',
      notes: 'Call Dr. Martinez office',
      completed: false,
      project: 'Personal',
      section: 's5',
      dueDate: 'Jan 12',
      priority: 'medium',
      duration: '15m',
    },
    {
      id: '23',
      title: 'Renew gym membership',
      notes: 'Check for annual discount',
      completed: false,
      project: 'Personal',
      section: 's5',
      dueDate: 'Jan 10',
      priority: 'low',
      duration: '20m',
    },
    {
      id: '24',
      title: 'Meal prep for the week',
      notes: 'Healthy lunches and snacks',
      completed: false,
      project: 'Personal',
      section: 's5',
      dueDate: 'Jan 14',
      priority: 'medium',
      duration: '2h',
    },
    // Personal - Home & Errands
    {
      id: '6',
      title: 'Buy groceries for the week',
      notes: 'Milk, eggs, bread, vegetables',
      completed: false,
      project: 'Personal',
      section: 's6',
      dueDate: 'Jan 9',
      priority: 'low',
      duration: '1h',
    },
    {
      id: '7',
      title: 'Plan weekend hiking trip',
      notes: 'Check weather and book campsite',
      completed: false,
      project: 'Personal',
      section: 's6',
      dueDate: 'Jan 13',
      priority: 'low',
      duration: '25m',
    },
    {
      id: '11',
      title: 'Organize home office',
      notes: 'Clean desk and update filing system',
      completed: false,
      project: 'Personal',
      section: 's6',
      dueDate: 'Jan 14',
      priority: 'medium',
      duration: '1h',
    },
    {
      id: '25',
      title: 'Drop off dry cleaning',
      notes: 'Winter coats and suits',
      completed: false,
      project: 'Personal',
      section: 's6',
      dueDate: 'Jan 10',
      priority: 'low',
      duration: '20m',
    },
    {
      id: '26',
      title: 'Fix leaky kitchen faucet',
      notes: 'Order replacement parts',
      completed: false,
      project: 'Personal',
      section: 's6',
      dueDate: 'Jan 15',
      priority: 'medium',
      duration: '1h',
    },
    {
      id: '27',
      title: 'Water plants and trim herbs',
      notes: 'Check indoor and balcony plants',
      completed: false,
      project: 'Personal',
      section: 's6',
      dueDate: 'Jan 11',
      priority: 'low',
      duration: '15m',
    },
    // Personal - Financial
    {
      id: '28',
      title: 'Review monthly budget',
      notes: 'Check spending vs. targets',
      completed: false,
      project: 'Personal',
      section: 's7',
      dueDate: 'Jan 10',
      priority: 'medium',
      duration: '30m',
    },
    {
      id: '29',
      title: 'Pay credit card bills',
      notes: 'Chase and Amex',
      completed: false,
      project: 'Personal',
      section: 's7',
      dueDate: 'Jan 12',
      priority: 'high',
      duration: '15m',
    },
    {
      id: '30',
      title: 'Update retirement contributions',
      notes: 'Increase 401k to max',
      completed: false,
      project: 'Personal',
      section: 's7',
      dueDate: 'Jan 16',
      priority: 'medium',
      duration: '25m',
    },
    {
      id: '31',
      title: 'Research tax deductions',
      notes: 'Prepare for tax season',
      completed: false,
      project: 'Personal',
      section: 's7',
      dueDate: 'Jan 18',
      priority: 'low',
      duration: '1h',
    },
    // Personal - Social
    {
      id: '32',
      title: 'Plan dinner party for friends',
      notes: 'Menu ideas and invite list',
      completed: false,
      project: 'Personal',
      section: 's8',
      dueDate: 'Jan 13',
      priority: 'low',
      duration: '30m',
    },
    {
      id: '33',
      title: 'Call Mom for her birthday',
      notes: 'Order flowers delivery',
      completed: false,
      project: 'Personal',
      section: 's8',
      dueDate: 'Jan 9',
      priority: 'high',
      duration: '30m',
    },
    {
      id: '34',
      title: 'RSVP to wedding invitation',
      notes: 'Book hotel for weekend',
      completed: false,
      project: 'Personal',
      section: 's8',
      dueDate: 'Jan 11',
      priority: 'medium',
      duration: '20m',
    },
    {
      id: '35',
      title: 'Organize game night',
      notes: 'Saturday evening, invite neighbors',
      completed: false,
      project: 'Personal',
      section: 's8',
      dueDate: 'Jan 17',
      priority: 'low',
      duration: '25m',
    },
    // Ideas - Content Creation
    {
      id: '9',
      title: 'Write blog post about remote work',
      notes: 'Share tips and experiences',
      completed: false,
      project: 'Ideas',
      section: 's9',
      dueDate: 'Jan 15',
      priority: 'medium',
      duration: '2h',
    },
    {
      id: '36',
      title: 'Edit and publish podcast episode',
      notes: 'Interview with Alex from last week',
      completed: false,
      project: 'Ideas',
      section: 's9',
      dueDate: 'Jan 12',
      priority: 'medium',
      duration: '3h',
    },
    {
      id: '37',
      title: 'Create social media content calendar',
      notes: 'Plan posts for next month',
      completed: false,
      project: 'Ideas',
      section: 's9',
      dueDate: 'Jan 14',
      priority: 'low',
      duration: '1h',
    },
    {
      id: '38',
      title: 'Film YouTube tutorial on productivity',
      notes: 'Time blocking techniques',
      completed: false,
      project: 'Ideas',
      section: 's9',
      dueDate: 'Jan 16',
      priority: 'medium',
      duration: '4h',
    },
    // Ideas - Learning
    {
      id: '10',
      title: 'Start learning Spanish',
      notes: 'Find good online course or app',
      completed: false,
      project: 'Ideas',
      section: 's10',
      dueDate: 'Jan 16',
      priority: 'low',
      duration: '30m',
    },
    {
      id: '39',
      title: 'Complete React advanced course module 3',
      notes: 'Custom hooks and performance',
      completed: false,
      project: 'Ideas',
      section: 's10',
      dueDate: 'Jan 13',
      priority: 'medium',
      duration: '2h',
    },
    {
      id: '40',
      title: 'Read "Atomic Habits" chapters 4-6',
      notes: 'Take notes on key concepts',
      completed: false,
      project: 'Ideas',
      section: 's10',
      dueDate: 'Jan 11',
      priority: 'low',
      duration: '1h',
    },
    {
      id: '41',
      title: 'Practice TypeScript exercises',
      notes: 'Advanced patterns and generics',
      completed: false,
      project: 'Ideas',
      section: 's10',
      dueDate: 'Jan 15',
      priority: 'low',
      duration: '45m',
    },
    // Ideas - Side Projects
    {
      id: '8',
      title: 'Research new productivity tools',
      notes: 'Compare features and pricing',
      completed: false,
      project: 'Ideas',
      section: 's11',
      dueDate: 'Jan 14',
      priority: 'low',
      duration: '45m',
    },
    {
      id: '42',
      title: 'Build MVP for habit tracker app',
      notes: 'Setup Next.js and database',
      completed: false,
      project: 'Ideas',
      section: 's11',
      dueDate: 'Jan 18',
      priority: 'medium',
      duration: '5h',
    },
    {
      id: '43',
      title: 'Design logo for side project',
      notes: 'Sketch ideas and color palette',
      completed: false,
      project: 'Ideas',
      section: 's11',
      dueDate: 'Jan 12',
      priority: 'low',
      duration: '1h',
    },
    {
      id: '44',
      title: 'Set up analytics for portfolio site',
      notes: 'Google Analytics or Plausible',
      completed: false,
      project: 'Ideas',
      section: 's11',
      dueDate: 'Jan 17',
      priority: 'low',
      duration: '30m',
    },
    {
      id: '45',
      title: 'Brainstorm newsletter topics',
      notes: 'Create content pipeline',
      completed: false,
      project: 'Ideas',
      section: 's11',
      dueDate: 'Jan 19',
      priority: 'low',
      duration: '45m',
    },
  ]);

  // Timeblocks data - get today and next days for the current week
  const getDateString = (daysOffset: number) => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + daysOffset);
    
    return targetDate.toISOString().split('T')[0];
  };

  const [timeblocks, setTimeblocks] = useState<Timeblock[]>([
    // Monday
    {
      id: 'tb1',
      label: 'Deep Work',
      startTime: '09:00',
      endTime: '11:30',
      date: getDateString(0), // Today
      color: '#007AFF',
      taskIds: ['1', '2'],
      isLocked: false,
    },
    {
      id: 'tb2',
      label: 'Team Meeting',
      startTime: '14:00',
      endTime: '15:00',
      date: getDateString(0),
      color: '#34C759',
      taskIds: ['3'],
      isLocked: true,
    },
    // Tuesday
    {
      id: 'tb3',
      label: 'Client Work',
      startTime: '10:00',
      endTime: '12:00',
      date: getDateString(1),
      color: '#FF9500',
      taskIds: ['12'],
      isLocked: false,
    },
    {
      id: 'tb4',
      startTime: '13:00',
      endTime: '14:30',
      date: getDateString(1),
      color: '#AF52DE',
      taskIds: ['15', '16'],
      isLocked: false,
    },
    {
      id: 'tb5',
      label: 'Lunch Meeting',
      startTime: '12:00',
      endTime: '13:00',
      date: getDateString(1),
      color: '#34C759',
      taskIds: [],
      isExternal: true,
      externalSource: 'google',
    },
    // Wednesday
    {
      id: 'tb6',
      label: 'Focus Time',
      startTime: '09:00',
      endTime: '12:00',
      date: getDateString(2),
      color: '#007AFF',
      taskIds: ['4', '17'],
      isLocked: false,
    },
    // Thursday
    {
      id: 'tb7',
      label: 'Design Review',
      startTime: '15:00',
      endTime: '16:30',
      date: getDateString(3),
      color: '#FF2D55',
      taskIds: ['18', '19'],
      isLocked: false,
    },
    {
      id: 'tb8',
      label: 'All Hands',
      startTime: '16:00',
      endTime: '17:00',
      date: getDateString(3),
      color: '#5AC8FA',
      taskIds: [],
      isExternal: true,
      externalSource: 'outlook',
    },
    // Friday
    {
      id: 'tb9',
      label: 'Creative Work',
      startTime: '09:30',
      endTime: '11:30',
      date: getDateString(4),
      color: '#AF52DE',
      taskIds: ['9', '36'],
      isLocked: false,
    },
    {
      id: 'tb10',
      label: 'Weekly Review',
      startTime: '16:00',
      endTime: '17:00',
      date: getDateString(4),
      color: '#FF9500',
      taskIds: [],
      isLocked: true,
    },
  ]);

  // Filters data
  const [filters, setFilters] = useState<Filter[]>([
    {
      id: 'f1',
      name: 'High Priority Work',
      color: '#FF3B30',
      icon: 'Flag',
      isFavorite: true,
      conditions: [
        { type: 'project', values: ['Work'] },
        { type: 'priority', values: ['high'] },
      ],
      sortBy: 'dueDate',
      sortOrder: 'asc',
    },
    {
      id: 'f2',
      name: 'This Week',
      color: '#007AFF',
      icon: 'Calendar',
      isFavorite: true,
      conditions: [
        { type: 'dueDate', values: ['This Week'] },
      ],
      sortBy: 'priority',
      sortOrder: 'desc',
    },
    {
      id: 'f3',
      name: 'Personal Tasks',
      color: '#AF52DE',
      icon: 'Briefcase',
      isFavorite: false,
      conditions: [
        { type: 'project', values: ['Personal'] },
      ],
      sortBy: 'dueDate',
      sortOrder: 'asc',
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<Filter | null>(null);

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleTaskClick = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setSelectedTask(task);
    }
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: '',
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    setSelectedTask(newTask);
  };

  const handleProjectClick = (projectId: string) => {
    // Normalize project name (capitalize first letter)
    const projectName = projectId.charAt(0).toUpperCase() + projectId.slice(1);
    setSelectedProject(projectName);
    setCurrentView('projects');
  };

  // Goals handlers
  const handleGoalClick = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) {
      setSelectedGoal(goal);
    }
  };

  const handleAddGoal = () => {
    const newGoal: Goal = {
      id: 'new',
      title: '',
    };
    setSelectedGoal(newGoal);
  };

  const handleSaveGoal = (updatedGoal: Goal) => {
    if (updatedGoal.id === 'new') {
      const goalWithId = { ...updatedGoal, id: Date.now().toString() };
      setGoals((prev) => [...prev, goalWithId]);
    } else {
      setGoals((prev) =>
        prev.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
      );
    }
  };

  // Habits handlers
  const handleHabitToggle = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? { ...habit, completedToday: !habit.completedToday }
          : habit
      )
    );
  };

  const handleHabitClick = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit) {
      setSelectedHabit(habit);
    }
  };

  const handleAddHabit = () => {
    const newHabit: Habit = {
      id: 'new',
      name: '',
      isActiveToday: true,
      completedToday: false,
    };
    setSelectedHabit(newHabit);
  };

  const handleSaveHabit = (updatedHabit: Habit) => {
    if (updatedHabit.id === 'new') {
      const habitWithId = { ...updatedHabit, id: Date.now().toString() };
      setHabits((prev) => [...prev, habitWithId]);
    } else {
      setHabits((prev) =>
        prev.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit))
      );
    }
  };

  // Timeblock handlers
  const handleTimeblockClick = (id: string) => {
    const timeblock = timeblocks.find((tb) => tb.id === id);
    if (timeblock) {
      setSelectedTimeblock(timeblock);
    }
  };

  const handleAddTimeblock = (date: string, startTime: string) => {
    const newTimeblock: Timeblock = {
      id: 'new',
      startTime,
      endTime: startTime, // Will be set in editor
      date,
      color: '#007AFF',
      taskIds: [],
    };
    setSelectedTimeblock(newTimeblock);
  };

  const handleSaveTimeblock = (updatedTimeblock: Timeblock) => {
    if (updatedTimeblock.id === 'new') {
      const timeblockWithId = { ...updatedTimeblock, id: Date.now().toString() };
      setTimeblocks((prev) => [...prev, timeblockWithId]);
    } else {
      setTimeblocks((prev) =>
        prev.map((tb) => (tb.id === updatedTimeblock.id ? updatedTimeblock : tb))
      );
    }
  };

  const handleDeleteTimeblock = (id: string) => {
    setTimeblocks((prev) => prev.filter((tb) => tb.id !== id));
    setSelectedTimeblock(null);
  };

  // Filter handlers
  const handleFilterClick = (id: string) => {
    const filterObj = filters.find((f) => f.id === id);
    if (filterObj) {
      setActiveFilter(filterObj);
      setCurrentView('inbox'); // Apply filter to inbox view
    }
  };

  const handleAddFilter = () => {
    const newFilter: Filter = {
      id: 'new',
      name: '',
      color: '#007AFF',
      conditions: [],
    };
    setSelectedFilter(newFilter);
  };

  const handleEditFilter = (id: string) => {
    const filterObj = filters.find((f) => f.id === id);
    if (filterObj) {
      setSelectedFilter(filterObj);
    }
  };

  const handleSaveFilter = (updatedFilter: Filter) => {
    if (updatedFilter.id === 'new') {
      const filterWithId = { ...updatedFilter, id: Date.now().toString() };
      setFilters((prev) => [...prev, filterWithId]);
    } else {
      setFilters((prev) =>
        prev.map((f) => (f.id === updatedFilter.id ? updatedFilter : f))
      );
    }
  };

  const handleDeleteFilter = (id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
    if (activeFilter?.id === id) {
      setActiveFilter(null);
    }
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    // Clear selected project when navigating away from projects view
    if (view !== 'projects') {
      setSelectedProject(null);
    }
  };

  const getViewTitle = () => {
    // If a project is selected, show project name instead
    if (currentView === 'projects' && selectedProject) {
      return selectedProject;
    }
    
    switch (currentView) {
      case 'inbox':
        return 'Inbox';
      case 'today':
        return 'Today';
      case 'upcoming':
        return 'Upcoming';
      case 'weekplan':
        return 'Planning';
      case 'projects':
        return 'Projects';
      case 'goals':
        return 'Goals';
      case 'habits':
        return 'Habits';
      default:
        return 'Inbox';
    }
  };

  const getFilteredTasks = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    switch (currentView) {
      case 'today':
        return tasks.filter((task) => task.dueDate === today);
      case 'upcoming':
        return tasks; // Week view will handle its own filtering
      default:
        return tasks;
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#FAFAF9]">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        isCollapsed={sidebarCollapsed}
        selectedProject={selectedProject}
        onProjectClick={handleProjectClick}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-12 flex items-center justify-between px-4 bg-white/80 backdrop-blur-xl border-b border-black/[0.06]">
          <h1 className="text-[17px] text-[#1D1D1F]">{getViewTitle()}</h1>

          {/* Page-specific options */}
          <div className="flex items-center gap-1.5">
            {currentView === 'weekplan' && (
              <div className="flex items-center gap-1 bg-black/[0.04] p-0.5 rounded-lg">
                <button
                  onClick={() => setPlanningViewMode('calendar')}
                  className={`px-3 py-1.5 rounded-md text-[13px] transition-colors flex items-center gap-1.5 ${
                    planningViewMode === 'calendar'
                      ? 'bg-white text-[#007AFF] shadow-sm'
                      : 'text-[#86868B] hover:text-[#1D1D1F]'
                  }`}
                >
                  <Calendar size={14} strokeWidth={2} />
                  <span>Calendar</span>
                </button>
                <button
                  onClick={() => setPlanningViewMode('kanban')}
                  className={`px-3 py-1.5 rounded-md text-[13px] transition-colors flex items-center gap-1.5 ${
                    planningViewMode === 'kanban'
                      ? 'bg-white text-[#007AFF] shadow-sm'
                      : 'text-[#86868B] hover:text-[#1D1D1F]'
                  }`}
                >
                  <Columns3 size={14} strokeWidth={2} />
                  <span>Kanban</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {currentView === 'inbox' && (
            <InboxView
              tasks={getFilteredTasks()}
              onToggle={handleToggleTask}
              onTaskClick={handleTaskClick}
              onUpdateTask={handleUpdateTask}
            />
          )}
          
          {currentView === 'today' && (
            <TodayView
              tasks={getFilteredTasks()}
              onToggle={handleToggleTask}
              onTaskClick={handleTaskClick}
              onUpdateTask={handleUpdateTask}
            />
          )}
          
          {currentView === 'upcoming' && (
            <WeekView
              tasks={getFilteredTasks()}
              onToggle={handleToggleTask}
              onTaskClick={handleTaskClick}
            />
          )}
          
          {currentView === 'weekplan' && (
            <WeekPlanView
              tasks={getFilteredTasks()}
              timeblocks={timeblocks}
              onToggle={handleToggleTask}
              onTaskClick={handleTaskClick}
              onUpdateTask={handleUpdateTask}
              onTimeblockClick={handleTimeblockClick}
              onAddTimeblock={handleAddTimeblock}
              viewMode={planningViewMode}
            />
          )}
          
          {currentView === 'projects' && (
            <ProjectsView
              tasks={getFilteredTasks()}
              sections={sections}
              onToggle={handleToggleTask}
              onTaskClick={handleTaskClick}
              selectedProject={selectedProject}
            />
          )}
          
          {currentView === 'goals' && (
            <GoalsView
              goals={goals}
              onGoalClick={handleGoalClick}
              onAddGoal={handleAddGoal}
            />
          )}
          
          {currentView === 'habits' && (
            <HabitsView
              habits={habits}
              onHabitToggle={handleHabitToggle}
              onHabitClick={handleHabitClick}
              onAddHabit={handleAddHabit}
            />
          )}
        </div>
      </div>

      {/* Task Editor */}
      <TaskEditor
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={handleSaveTask}
      />

      {/* Goal Editor */}
      <GoalEditor
        goal={selectedGoal}
        goals={goals}
        lifeAreas={lifeAreas}
        tasks={tasks}
        habits={habits}
        onClose={() => setSelectedGoal(null)}
        onSave={handleSaveGoal}
      />

      {/* Habit Editor */}
      <HabitEditor
        habit={selectedHabit}
        goals={goals}
        lifeAreas={lifeAreas}
        onClose={() => setSelectedHabit(null)}
        onSave={handleSaveHabit}
      />

      {/* Timeblock Editor */}
      <TimeblockEditor
        timeblock={selectedTimeblock}
        tasks={tasks}
        onClose={() => setSelectedTimeblock(null)}
        onSave={handleSaveTimeblock}
        onDelete={handleDeleteTimeblock}
      />

      {/* Filter Editor */}
      <FilterEditor
        filter={selectedFilter}
        onClose={() => setSelectedFilter(null)}
        onSave={handleSaveFilter}
        onDelete={handleDeleteFilter}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        todoistApiKey={todoistApiKey}
        onTodoistApiKeyChange={setTodoistApiKey}
        lifeAreas={lifeAreas}
        onLifeAreasChange={setLifeAreas}
      />
    </div>
  );
}