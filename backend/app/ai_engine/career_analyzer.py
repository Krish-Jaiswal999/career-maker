"""
AI Engine for Career Path Analysis
- Career goal understanding
- Skill gap detection
- Industry path mapping
"""

from typing import List, Dict, Optional
import json

from .role_skill_api import RoleSkillAPIClient

class CareerAnalyzer:
    """Analyzes career goals and current skills"""
    
    def __init__(self):
        # Skill variant mapping - maps variants to their canonical form
        self.skill_aliases = {
            # SQL variants
            "mysql": "SQL",
            "postgresql": "SQL",
            "postgres": "SQL",
            "oracle": "SQL",
            "mssql": "SQL",
            "sql server": "SQL",
            "mariadb": "SQL",
            
            # Deep Learning frameworks
            "tensorflow": "Deep Learning",
            "pytorch": "Deep Learning",
            "keras": "Deep Learning",
            
            # Frontend frameworks
            "react": "Frontend Framework",
            "vue": "Frontend Framework",
            "angular": "Frontend Framework",
            "svelte": "Frontend Framework",
            
            # Cloud platforms
            "aws": "Cloud Platform",
            "gcp": "Cloud Platform",
            "google cloud": "Cloud Platform",
            "azure": "Cloud Platform",
            "microsoft azure": "Cloud Platform",
            
            # Container tools
            "docker": "Container",
            "kubernetes": "Container",
            "k8s": "Container",
            
            # NoSQL databases
            "mongodb": "NoSQL",
            "cassandra": "NoSQL",
            "dynamodb": "NoSQL",
            "redis": "NoSQL",
            
            # Machine Learning libraries
            "scikit-learn": "Machine Learning",
            "scikit_learn": "Machine Learning",
            "sklearn": "Machine Learning",
            "xgboost": "Machine Learning",
            "lightgbm": "Machine Learning",
            
            # Data Processing
            "pandas": "Data Processing",
            "numpy": "Data Processing",
            "scipy": "Data Processing",
            
            # CAD / Design
            "solidworks": "SolidWorks",
            "autocad": "CAD",
            "catia": "CAD",
            "inventor": "CAD",
            "proe": "CAD",
            "cad": "CAD",
            "gd&t": "GD&T",
            
            # HVAC
            "hvac": "HVAC Design",
            "thermodynamics": "Thermodynamics",
            "energy modeling": "Energy Modeling",
            
            # Manufacturing / Production
            "lean": "Lean Manufacturing",
            "kaizen": "Lean Manufacturing",
            "quality control": "Quality Control",
            "process improvement": "Process Improvement",
            
            # Culinary / Hospitality
            "cooking": "Culinary Skills",
            "food safety": "Food Safety",
            "menu planning": "Menu Planning",
            
            # Fire / Safety
            "fire safety": "Fire Safety",
            "emergency response": "Emergency Response",
            "inspection": "Inspection",
            
            # API Frameworks
            "fastapi": "API Framework",
            "flask": "API Framework",
            "django": "API Framework",
            "express": "API Framework",
            "node.js": "Node.js",
            "nodejs": "Node.js",
            "express.js": "API Framework",
        }
        
        self.skill_categories = {
            "programming_languages": ["Python", "JavaScript", "Java", "C++", "Go", "Rust"],
            "frameworks": ["FastAPI", "Flask", "Django", "React", "Vue", "Angular"],
            "databases": ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Cassandra"],
            "ml_frameworks": ["TensorFlow", "PyTorch", "Scikit-learn", "XGBoost"],
            "data_tools": ["Pandas", "NumPy", "Spark", "Hadoop"],
            "devops": ["Docker", "Kubernetes", "AWS", "GCP", "Terraform"],
            "soft_skills": ["Leadership", "Communication", "Project Management", "Problem Solving"]
        }

        self.career_skill_map = {
            "machine learning engineer": ["Python", "Deep Learning", "Statistics", "SQL", "Data Processing"],
            "machine learning": ["Python", "Deep Learning", "Statistics", "SQL", "Data Processing"],
            "ml engineer": ["Python", "Deep Learning", "Statistics", "SQL", "Data Processing"],
            "ml engineering": ["Python", "Deep Learning", "Statistics", "SQL", "Data Processing"],
            "data scientist": ["Python", "SQL", "Data Processing", "Machine Learning", "Data Visualization"],
            "data science": ["Python", "SQL", "Data Processing", "Machine Learning", "Data Visualization"],
            "full stack developer": ["JavaScript", "Frontend Framework", "API Framework", "SQL", "Container"],
            "fullstack": ["JavaScript", "Frontend Framework", "API Framework", "SQL", "Container"],
            "backend engineer": ["Python", "API Framework", "SQL", "NoSQL", "Cloud Platform"],
            "backend": ["Python", "API Framework", "SQL", "NoSQL", "Cloud Platform"],
            "software engineer": ["Python", "API Framework", "SQL", "Cloud Platform", "Problem Solving"],
            "software developer": ["Python", "API Framework", "SQL", "Cloud Platform", "Problem Solving"],
            "data engineer": ["Python", "SQL", "ETL", "Data Warehousing", "Cloud Platform"],
            "qa engineer": ["Test Automation", "Quality Assurance", "Bug Tracking", "Scripting", "Reporting"],
            "quality assurance engineer": ["Test Automation", "Quality Assurance", "Bug Tracking", "Scripting", "Reporting"],
            "mechanical design engineer": ["CAD", "SolidWorks", "GD&T", "Materials Science", "Design for Manufacturing"],
            "mechanical engineer": ["CAD", "SolidWorks", "Engineering Drawings", "Materials Science", "Design for Manufacturing"],
            "product development engineer": ["Product Design", "Prototyping", "Requirements Analysis", "CAD", "Testing"],
            "manufacturing engineer": ["Process Design", "Lean Manufacturing", "Quality Control", "Automation", "Production Planning"],
            "hvac engineer": ["HVAC Design", "Thermodynamics", "Building Codes", "Energy Modeling", "Ductwork Controls"],
            "fire engineer": ["Fire Safety", "Risk Assessment", "Building Codes", "Fire Protection Systems", "Emergency Response"],
            "fire investigator": ["Incident Investigation", "Fire Cause Analysis", "Evidence Collection", "Report Writing", "Fire Safety"],
            "chef": ["Culinary Skills", "Menu Planning", "Food Safety", "Kitchen Management", "Plating"],
            "automotive engineer": ["Vehicle Systems", "CAD", "Diagnostics", "Materials Engineering", "Testing"],
            "sweeper": ["Cleaning Procedures", "Equipment Operation", "Safety", "Time Management", "Waste Disposal"],
            "janitor": ["Cleaning Procedures", "Equipment Operation", "Safety", "Time Management", "Waste Disposal"],
            "cleaner": ["Cleaning Procedures", "Equipment Operation", "Safety", "Time Management", "Waste Disposal"],
            "devops engineer": ["Container", "Cloud Platform", "Linux", "CI/CD", "Infrastructure as Code"],
            "devops": ["Container", "Cloud Platform", "Linux", "CI/CD", "Infrastructure as Code"],
            "frontend engineer": ["JavaScript", "Frontend Framework", "CSS", "HTML", "TypeScript"],
            "frontend": ["JavaScript", "Frontend Framework", "CSS", "HTML", "TypeScript"],
            "mern stack developer": ["JavaScript", "Frontend Framework", "API Framework", "NoSQL", "Node.js"],
            "mern": ["JavaScript", "Frontend Framework", "API Framework", "NoSQL", "Node.js"],
            "mean stack developer": ["JavaScript", "Frontend Framework", "API Framework", "NoSQL", "Node.js"],
            "mean": ["JavaScript", "Frontend Framework", "API Framework", "NoSQL", "Node.js"],
            "cloud architect": ["Cloud Platform", "Container", "Infrastructure as Code", "Database Design", "Security"],
            "cloud": ["Cloud Platform", "Container", "Infrastructure as Code", "Database Design", "Security"],
            "marketing manager": ["Marketing Strategy", "Campaign Planning", "Digital Marketing", "Analytics", "Communication"],
            "sales executive": ["Sales Strategy", "Customer Relationship Management", "Negotiation", "Communication", "Reporting"],
            "human resources manager": ["Recruitment", "Employee Relations", "HR Compliance", "Performance Management", "Communication"],
            "graphic designer": ["Visual Design", "Typography", "Branding", "Adobe Creative Suite", "Layout"],
            "business analyst": ["Requirements Gathering", "Process Modeling", "Data Analysis", "Stakeholder Communication", "Reporting"],
            "financial analyst": ["Financial Modeling", "Excel", "Forecasting", "Data Analysis", "Reporting"],
            "project manager": ["Project Planning", "Risk Management", "Stakeholder Communication", "Time Management", "Budgeting"],
            "product manager": ["Product Strategy", "Market Research", "Roadmapping", "Stakeholder Alignment", "Metrics"],
            "teacher": ["Curriculum Planning", "Lesson Delivery", "Classroom Management", "Assessment Design", "Communication"],
            "nurse": ["Patient Care", "Clinical Procedures", "Medical Documentation", "Team Collaboration", "Health & Safety"],
            "accountant": ["Financial Reporting", "Tax Compliance", "Bookkeeping", "Excel", "Audit Process"],
            "customer service representative": ["Customer Experience", "Communication", "Problem Solving", "CRM Tools", "Conflict Resolution"],
            "operations manager": ["Operations Planning", "Process Improvement", "Resource Allocation", "KPI Management", "Team Leadership"],
            "data analyst": ["SQL", "Excel", "Data Visualization", "Reporting", "Statistics"],
            "ux designer": ["User Research", "Wireframing", "Prototyping", "Interaction Design", "Usability Testing"],
        }

        self.career_trajectory_map = {
            "machine learning engineer": ["Data Fundamentals", "Model Development", "Deployment & Monitoring", "Optimization"],
            "data scientist": ["Data Collection", "Exploratory Analysis", "Modeling", "Insight Communication"],
            "data engineer": ["Data Architecture", "ETL Development", "Pipeline Optimization", "Scalable Infrastructure"],
            "full stack developer": ["Frontend Development", "Backend Development", "Integration", "Deployment"],
            "backend engineer": ["Backend Architecture", "API Development", "Data Management", "Performance Tuning"],
            "software engineer": ["Foundations", "Design & Implementation", "System Integration", "Scaling"],
            "devops engineer": ["Infrastructure Setup", "Automation", "Monitoring", "Resilience"],
            "cloud architect": ["Cloud Fundamentals", "Architecture Design", "Security & Governance", "Optimization"],
            "project manager": ["Initiation", "Planning", "Execution", "Delivery"],
            "product manager": ["Research", "Strategy", "Execution", "Launch"],
            "marketing manager": ["Audience Research", "Campaign Design", "Execution", "Measurement"],
            "sales executive": ["Prospecting", "Qualification", "Closing", "Account Growth"],
            "business analyst": ["Requirements Gathering", "Analysis", "Recommendations", "Stakeholder Alignment"],
            "financial analyst": ["Financial Planning", "Analysis", "Forecasting", "Reporting"],
            "graphic designer": ["Research", "Concept Development", "Design Execution", "Delivery"],
            "ux designer": ["Research", "Wireframing", "Prototyping", "Testing"],
            "teacher": ["Curriculum Development", "Lesson Preparation", "Instruction", "Assessment"],
            "nurse": ["Clinical Foundations", "Patient Care", "Care Coordination", "Professional Growth"],
            "accountant": ["Accounting Basics", "Reporting", "Compliance", "Advisory"],
            "customer service representative": ["Customer Communication", "Problem Resolution", "Service Improvement", "Relationship Building"],
            "operations manager": ["Process Mapping", "Planning", "Execution", "Continuous Improvement"],
            "mechanical engineer": ["Concept Design", "Detailed Engineering", "Testing", "Implementation"],
            "chef": ["Culinary Foundations", "Menu Development", "Kitchen Leadership", "Culinary Innovation"],
            "fire investigator": ["Incident Response", "Evidence Collection", "Analysis", "Reporting"],
        }

        self.role_skill_api = RoleSkillAPIClient()
    
    def normalize_skill(self, skill: str) -> str:
        """Normalize a skill to its canonical form (handles aliases/variants)"""
        skill_lower = skill.lower()
        if skill_lower in self.skill_aliases:
            return self.skill_aliases[skill_lower]
        return skill
    
    def detect_skill_gaps(self, career_goal: str, current_skills: List[str]) -> Dict:
        """Detect skills needed for the career goal"""
        
        goal_key = self._normalize_goal(career_goal)
        needed_skills = self.career_skill_map.get(goal_key)
        if needed_skills is None:
            remote_skills = self.role_skill_api.get_role_skills(goal_key)
            if remote_skills:
                needed_skills = remote_skills
            else:
                needed_skills = self._infer_skills_from_goal(goal_key)

        # Normalize current skills to their canonical forms
        normalized_current = set()
        for skill in current_skills:
            normalized = self.normalize_skill(skill)
            normalized_current.add(normalized.lower())
        
        # Find gaps - compare normalized needed skills with normalized current skills
        gaps = []
        needed_set = set()
        for skill in needed_skills:
            skill_lower = skill.lower()
            needed_set.add(skill_lower)
            if skill_lower not in normalized_current:
                gaps.append(skill)
        
        return {
            "career_goal": career_goal,
            "current_skills": current_skills,
            "skill_gaps": gaps,
            "proficiency_gaps": len(gaps),
            "total_required_skills": len(needed_set),
            "learned_skills_count": len(needed_set) - len(gaps),
            "completion_percentage": ((len(needed_set) - len(gaps)) / len(needed_set) * 100) if needed_set else 0
        }
    
    def map_career_trajectory(self, goal: str) -> Dict:
        """Map the career trajectory for the goal"""
        
        goal_key = self._normalize_goal(goal)
        steps = self.career_trajectory_map.get(goal_key)
        if steps is None:
            steps = self._infer_trajectory_from_goal(goal_key)
        
        return {
            "career_goal": goal,
            "trajectory_steps": steps,
            "total_steps": len(steps)
        }

    def _normalize_goal(self, goal: str) -> str:
        """Normalize career goal text to a consistent key"""
        return goal.strip().lower()

    def _infer_skills_from_goal(self, goal_key: str) -> List[str]:
        """Infer a conservative role-specific skill set from the career goal"""
        for mapped_goal in self.career_skill_map:
            if mapped_goal in goal_key:
                return self.career_skill_map[mapped_goal]
        
        # Use keyword heuristics for non-IT roles and avoid generic IT defaults
        if any(keyword in goal_key for keyword in ["manager", "director", "lead"]):
            return ["Leadership", "Communication", "Planning", "Stakeholder Management", "Decision Making"]
        if any(keyword in goal_key for keyword in ["analyst", "analytics", "analysis"]):
            return ["Data Analysis", "Reporting", "Communication", "Problem Solving", "Domain Knowledge"]
        if any(keyword in goal_key for keyword in ["designer", "design", "ux", "ui"]):
            return ["Visual Design", "User Research", "Prototyping", "Typography", "Communication"]
        if any(keyword in goal_key for keyword in ["sales", "customer", "service"]):
            return ["Customer Relationship Management", "Communication", "Negotiation", "Problem Solving", "Product Knowledge"]
        if any(keyword in goal_key for keyword in ["teacher", "trainer", "educator"]):
            return ["Lesson Planning", "Instructional Delivery", "Classroom Management", "Assessment", "Communication"]
        if any(keyword in goal_key for keyword in ["accountant", "finance", "financial", "auditor"]):
            return ["Financial Reporting", "Compliance", "Excel", "Attention to Detail", "Analytical Thinking"]
        if any(keyword in goal_key for keyword in ["nurse", "clinical", "caregiver"]):
            return ["Patient Care", "Clinical Procedures", "Medical Documentation", "Safety", "Team Collaboration"]
        if any(keyword in goal_key for keyword in ["operations", "logistics", "supply chain"]):
            return ["Process Improvement", "Resource Management", "KPI Tracking", "Communication", "Decision Making"]
        if any(keyword in goal_key for keyword in ["mechanical", "hvac", "manufacturing", "product development"]):
            return ["Technical Design", "Field-Specific Engineering", "Problem Solving", "Documentation", "Standards Compliance"]
        if any(keyword in goal_key for keyword in ["fire", "firefighter", "fire investigator", "fire safety"]):
            return ["Fire Safety", "Risk Assessment", "Code Compliance", "Emergency Response", "Investigation" ]
        if any(keyword in goal_key for keyword in ["chef", "cook", "culinary", "kitchen"]):
            return ["Culinary Skills", "Menu Planning", "Food Safety", "Kitchen Operations", "Customer Service"]
        if any(keyword in goal_key for keyword in ["automotive", "vehicle", "car"]):
            return ["Vehicle Systems", "Diagnostics", "CAD", "Materials Engineering", "Testing"]
        if any(keyword in goal_key for keyword in ["sweeper", "janitor", "cleaner", "custodian"]):
            return ["Cleaning Procedures", "Equipment Operation", "Safety", "Scheduling", "Waste Disposal"]
        if any(keyword in goal_key for keyword in ["teacher", "trainer", "educator"]):
            return ["Lesson Planning", "Instructional Delivery", "Classroom Management", "Assessment", "Communication"]
        if "engineer" in goal_key:
            return ["Technical Design", "Problem Solving", "Documentation", "Project Planning", "Standards Compliance"]
        
        return ["Role-specific knowledge", "Communication", "Problem Solving", "Professionalism"]

    def _infer_trajectory_from_goal(self, goal_key: str) -> List[str]:
        """Infer a more generic trajectory when the exact role isn't mapped"""
        for mapped_goal in self.career_trajectory_map:
            if mapped_goal in goal_key:
                return self.career_trajectory_map[mapped_goal]
        
        return ["Foundation", "Intermediate", "Advanced", "Expert"]

class RoadmapGenerator:
    """Generates personalized learning roadmaps"""
    
    def __init__(self):
        self.phase_durations = {
            "Foundation": "4-6 weeks",
            "Intermediate": "8-12 weeks",
            "Advanced": "12-16 weeks",
            "Expert": "Ongoing"
        }
        # Map skills to realistic project ideas
        self.skill_projects = {
            "Python": ["Build a CLI Tool", "Web Scraper", "Data Analysis Script"],
            "JavaScript": ["Interactive Web App", "DOM Manipulation Project", "Browser Games"],
            "Frontend Framework": ["Todo App", "Weather Dashboard", "Social Media Feed UI"],
            "API Framework": ["REST API Backend", "User Authentication System", "Microservice"],
            "SQL": ["Complex Queries", "Database Design", "Data Reporting"],
            "Deep Learning": ["Image Classification Model", "Neural Network", "Time Series Prediction"],
            "Container": ["Containerize Application", "Multi-container Setup", "Docker Compose"],
            "Cloud Platform": ["Deploy on Cloud", "Serverless Functions", "Data Pipeline"],
            "NoSQL": ["NoSQL Database Design", "Document Queries", "Data Migration"],
            "Statistics": ["Statistical Analysis", "Hypothesis Testing", "Data Visualization"],
            "Machine Learning": ["Predictive Model", "Feature Engineering", "Model Comparison"],
            "Data Processing": ["Data Cleaning", "Feature Engineering", "Data Pipeline"],
            "Data Visualization": ["Dashboard Creation", "Interactive Charts", "Data Storytelling"],
            "CI/CD": ["Automated Testing", "Deployment Pipeline", "Monitoring Setup"],
            "Infrastructure as Code": ["IaC Configuration", "Terraform Scripts", "Helm Charts"],
            "TypeScript": ["Type-Safe App", "Type Definitions", "Typed Library"],
            "HTML": ["Semantic Markup", "Accessible Pages", "Web Components"],
            "CSS": ["Responsive Design", "CSS Grid Layout", "Animation Effects"],
            "Linux": ["Shell Scripting", "System Administration", "Process Management"],
        }
    
    def generate_roadmap(self, career_goal: str, current_skills: List[str], years_exp: int) -> Dict:
        """Generate a detailed roadmap"""
        
        analyzer = CareerAnalyzer()
        gaps = analyzer.detect_skill_gaps(career_goal, current_skills)
        
        roadmap = {
            "goal": career_goal,
            "phases": self._create_phases(career_goal, gaps["skill_gaps"]),
            "total_duration": self._estimate_duration(len(gaps["skill_gaps"])),
            "milestone_count": 4,
            "projects_count": 8
        }
        
        return roadmap
    
    def _create_phases(self, goal: str, skill_gaps: List[str]) -> List[Dict]:
        """Create individual phases for the roadmap"""
        
        phases = []
        
        # Foundation Phase
        phases.append({
            "phase_number": 1,
            "phase_name": "Foundation",
            "duration": "4-6 weeks",
            "skills": skill_gaps[:2] if skill_gaps else ["Fundamentals"],
            "projects": self._get_projects_for_skills(skill_gaps[:2] if skill_gaps else ["Python"]),
            "resources": ["YouTube Tutorial", "Official Documentation"],
            "milestones": ["Complete basic tutorials", "First mini-project"],
            "order": 1
        })
        
        # Intermediate Phase
        if len(skill_gaps) > 2:
            phases.append({
                "phase_number": 2,
                "phase_name": "Intermediate",
                "duration": "8-12 weeks",
                "skills": skill_gaps[2:4] if len(skill_gaps) > 4 else skill_gaps[2:],
                "projects": self._get_projects_for_skills(skill_gaps[2:4] if len(skill_gaps) > 4 else skill_gaps[2:]),
                "resources": ["Udemy Course", "Blog Posts"],
                "milestones": ["Build intermediate project", "Contribute to open source"],
                "order": 2
            })
        
        # Advanced Phase
        if len(skill_gaps) > 4:
            phases.append({
                "phase_number": 3,
                "phase_name": "Advanced",
                "duration": "12-16 weeks",
                "skills": skill_gaps[4:],
                "projects": self._get_projects_for_skills(skill_gaps[4:]),
                "resources": ["Research Papers", "Advanced Courses"],
                "milestones": ["Advanced project completion", "System design"],
                "order": 3
            })
        
        return phases
    
    def _get_projects_for_skills(self, skills: List[str]) -> List[str]:
        """Get relevant project recommendations for given skills"""
        projects = set()
        
        for skill in skills:
            # Check if skill is in the map (case-insensitive)
            for key, project_list in self.skill_projects.items():
                if key.lower() == skill.lower():
                    projects.update(project_list[:2])  # Add top 2 projects per skill
                    break
        
        # Return up to 3 unique projects
        return list(projects)[:3] if projects else ["Build a practical project with your new skills"]
    
    def _estimate_duration(self, gap_count: int) -> str:
        """Estimate total learning duration"""
        months = gap_count * 2  # 2 months per skill approximately
        return f"{months}-{months + 4} weeks"
