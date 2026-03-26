from app.database.database import SessionLocal
from app.database.models import Profile, Roadmap
from app.ai_engine.career_analyzer import CareerAnalyzer, RoadmapGenerator

db = SessionLocal()
profile = db.query(Profile).first()

if profile:
    print('=== DATABASE ===')
    print('Skills in DB:', profile.current_skills)
    print('Goal in DB:', profile.career_goal)
    
    print('\n=== TESTING MERN STACK ===')
    test_skills = ['Python', 'MySQL', 'JavaScript']
    test_goal = 'MERN stack developer'
    print(f'Testing with skills: {test_skills}, goal: {test_goal}')
    analyzer = CareerAnalyzer()
    
    # Debug normalization
    normalized_current = set()
    for skill in test_skills:
        normalized = analyzer.normalize_skill(skill)
        print(f"Skill '{skill}' -> normalized '{normalized}' -> lower '{normalized.lower()}'")
        normalized_current.add(normalized.lower())
    
    print(f"Normalized current skills set: {normalized_current}")
    
    gaps = analyzer.detect_skill_gaps(test_goal, test_skills)
    print('Detected gaps:', gaps['skill_gaps'])
    print('Total required skills:', gaps['total_required_skills'])
    print('Completion percentage:', gaps['completion_percentage'])
    
    print('\n=== SKILL GAP ANALYSIS ===')
    gaps = analyzer.detect_skill_gaps(profile.career_goal, profile.current_skills)
    print('Detected gaps:', gaps['skill_gaps'])
    print('Total required skills:', gaps['total_required_skills'])
    print('Completion percentage:', gaps['completion_percentage'])
    
    print('\n=== ROADMAP GENERATION ===')
    gen = RoadmapGenerator()
    roadmap = gen.generate_roadmap(profile.career_goal, profile.current_skills, 2)
    print('Phase 1 skills to learn:', roadmap['phases'][0]['skills'])
    
    print('\n=== DATABASE ROADMAP ===')
    db_roadmap = db.query(Roadmap).first()
    if db_roadmap:
        print('Stored Phase 1 skills:', db_roadmap.phases[0]['skills'])
    else:
        print('No roadmap in database yet')
