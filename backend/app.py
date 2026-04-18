from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import os
import jwt
import datetime
import requests
import json
import re
import random

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'super-secret-key-for-jwt')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///skilltest.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# ─────────────────────────────────────────────
# DATABASE MODELS
# ─────────────────────────────────────────────

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Test(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    skill = db.Column(db.String(50), nullable=False)
    difficulty = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

with app.app_context():
    db.create_all()

# ─────────────────────────────────────────────
# FALLBACK QUESTION BANK (used if AI fails)
# ─────────────────────────────────────────────

FALLBACK_QUESTIONS = {
    "python": [
        {"question": "What is the output of `print(type([]))`?", "options": ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'dict'>"], "correct_answer": "<class 'list'>"},
        {"question": "Which keyword is used to define a function in Python?", "options": ["func", "def", "function", "define"], "correct_answer": "def"},
        {"question": "What does `len('hello')` return?", "options": ["4", "5", "6", "Error"], "correct_answer": "5"},
        {"question": "Which of the following is immutable in Python?", "options": ["list", "dict", "tuple", "set"], "correct_answer": "tuple"},
        {"question": "What is the correct way to create a dictionary in Python?", "options": ["d = []", "d = ()", "d = {}", "d = <> "], "correct_answer": "d = {}"},
        {"question": "What does `range(5)` produce?", "options": ["[1,2,3,4,5]", "[0,1,2,3,4]", "[0,1,2,3,4,5]", "[1,2,3,4]"], "correct_answer": "[0,1,2,3,4]"},
        {"question": "Which method removes the last element from a list?", "options": ["remove()", "pop()", "delete()", "discard()"], "correct_answer": "pop()"},
        {"question": "What is a lambda function in Python?", "options": ["A named function", "An anonymous function", "A built-in function", "A recursive function"], "correct_answer": "An anonymous function"},
        {"question": "What symbol is used for single-line comments in Python?", "options": ["//", "#", "/* */", "--"], "correct_answer": "#"},
        {"question": "Which built-in function returns the largest item?", "options": ["largest()", "max()", "top()", "high()"], "correct_answer": "max()"},
        {"question": "What does `'abc'.upper()` return?", "options": ["abc", "ABC", "Abc", "Error"], "correct_answer": "ABC"},
        {"question": "What is PEP 8 in Python?", "options": ["A Python version", "A style guide", "A package manager", "A testing framework"], "correct_answer": "A style guide"},
    ],
    "java": [
        {"question": "Which keyword is used to inherit a class in Java?", "options": ["implements", "extends", "inherits", "super"], "correct_answer": "extends"},
        {"question": "What is the default value of an int variable in Java?", "options": ["null", "0", "1", "undefined"], "correct_answer": "0"},
        {"question": "Which method is the entry point of a Java program?", "options": ["start()", "run()", "main()", "init()"], "correct_answer": "main()"},
        {"question": "What does JVM stand for?", "options": ["Java Virtual Machine", "Java Variable Method", "Java Version Manager", "Java Verified Module"], "correct_answer": "Java Virtual Machine"},
        {"question": "Which of the following is not a Java primitive type?", "options": ["int", "boolean", "String", "char"], "correct_answer": "String"},
        {"question": "What is the size of an int in Java?", "options": ["8 bits", "16 bits", "32 bits", "64 bits"], "correct_answer": "32 bits"},
        {"question": "Which access modifier makes a member accessible only within its class?", "options": ["public", "protected", "private", "default"], "correct_answer": "private"},
        {"question": "What does the `final` keyword do to a variable?", "options": ["Makes it null", "Makes it constant", "Makes it global", "Makes it static"], "correct_answer": "Makes it constant"},
        {"question": "Which interface must be implemented to use ArrayList?", "options": ["List", "Collection", "Iterable", "No interface needed"], "correct_answer": "No interface needed"},
        {"question": "What is autoboxing in Java?", "options": ["Converting Object to primitive", "Converting primitive to Object", "Casting int to float", "Importing packages"], "correct_answer": "Converting primitive to Object"},
    ],
    "react": [
        {"question": "What hook is used to manage state in a functional component?", "options": ["useEffect", "useState", "useContext", "useRef"], "correct_answer": "useState"},
        {"question": "What does JSX stand for?", "options": ["JavaScript XML", "Java Syntax Extension", "JavaScript Extension", "Java XML"], "correct_answer": "JavaScript XML"},
        {"question": "Which method triggers a re-render in React?", "options": ["forceUpdate()", "setState()", "render()", "update()"], "correct_answer": "setState()"},
        {"question": "What is the Virtual DOM?", "options": ["A copy of the real DOM in memory", "A CSS framework", "A JavaScript engine", "A browser API"], "correct_answer": "A copy of the real DOM in memory"},
        {"question": "Which hook runs after every render by default?", "options": ["useState", "useRef", "useEffect", "useMemo"], "correct_answer": "useEffect"},
        {"question": "What is a React key used for?", "options": ["Styling", "Uniquely identifying list items", "Event handling", "State management"], "correct_answer": "Uniquely identifying list items"},
        {"question": "What is the correct way to pass data to a child component?", "options": ["Using state", "Using props", "Using context only", "Using ref"], "correct_answer": "Using props"},
        {"question": "Which library is commonly used for routing in React?", "options": ["react-nav", "react-router-dom", "react-link", "router-react"], "correct_answer": "react-router-dom"},
        {"question": "What does `useContext` do?", "options": ["Manages local state", "Subscribes to context", "Handles side effects", "Creates refs"], "correct_answer": "Subscribes to context"},
        {"question": "What is a controlled component?", "options": ["Component with no state", "Component whose form data is controlled by React state", "Component with context", "Component using refs"], "correct_answer": "Component whose form data is controlled by React state"},
    ],
    "data-science": [
        {"question": "What does pandas library primarily deal with?", "options": ["Machine Learning", "Data manipulation and analysis", "Web scraping", "Visualization only"], "correct_answer": "Data manipulation and analysis"},
        {"question": "Which algorithm is used for classification and regression?", "options": ["K-Means", "PCA", "Random Forest", "DBSCAN"], "correct_answer": "Random Forest"},
        {"question": "What does NaN stand for in data science?", "options": ["Not a Node", "Not a Number", "Null and None", "Numeric and Non-numeric"], "correct_answer": "Not a Number"},
        {"question": "Which library is used for data visualization in Python?", "options": ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"], "correct_answer": "Matplotlib"},
        {"question": "What is overfitting in machine learning?", "options": ["Model performs poorly on training data", "Model performs well on training but poorly on new data", "Model is too simple", "Model has too few parameters"], "correct_answer": "Model performs well on training but poorly on new data"},
        {"question": "What does PCA stand for?", "options": ["Principal Component Analysis", "Primary Cluster Algorithm", "Predictive Component Array", "Parametric Correlation Analysis"], "correct_answer": "Principal Component Analysis"},
        {"question": "What is a confusion matrix used for?", "options": ["Feature selection", "Evaluating classification model performance", "Data normalization", "Clustering"], "correct_answer": "Evaluating classification model performance"},
        {"question": "Which measure represents the middle value of a dataset?", "options": ["Mean", "Mode", "Median", "Range"], "correct_answer": "Median"},
        {"question": "What is the purpose of train-test split?", "options": ["To clean data", "To evaluate model on unseen data", "To normalize features", "To remove outliers"], "correct_answer": "To evaluate model on unseen data"},
        {"question": "Which Python library is used for machine learning?", "options": ["Flask", "Django", "Scikit-learn", "SQLAlchemy"], "correct_answer": "Scikit-learn"},
    ],
}

def get_fallback_questions(skill, count=10):
    """Return shuffled fallback questions for the given skill."""
    key = skill.lower().replace(" ", "-")
    pool = FALLBACK_QUESTIONS.get(key, FALLBACK_QUESTIONS.get("python", []))
    questions = random.sample(pool, min(count, len(pool)))
    return questions

# ─────────────────────────────────────────────
# JWT AUTH DECORATOR
# ─────────────────────────────────────────────

def token_required(f):
    def decorator(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token is missing'}), 401
        token = auth_header.split(' ')[1]
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except Exception:
            return jsonify({'error': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    decorator.__name__ = f.__name__
    return decorator

# ─────────────────────────────────────────────
# AUTH ROUTES
# ─────────────────────────────────────────────

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'error': 'Missing required fields'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    # Auto login after register
    token = jwt.encode(
        {'user_id': new_user.id, 'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)},
        app.config['SECRET_KEY'],
        algorithm="HS256"
    )
    return jsonify({'message': 'User registered successfully', 'token': token, 'user': {'name': new_user.name, 'email': new_user.email}}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing credentials'}), 400
    user = User.query.filter_by(email=data['email']).first()
    if not user or not bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    token = jwt.encode(
        {'user_id': user.id, 'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)},
        app.config['SECRET_KEY'],
        algorithm="HS256"
    )
    return jsonify({'token': token, 'user': {'name': user.name, 'email': user.email}})

# ─────────────────────────────────────────────
# AI QUESTION GENERATION (with fallback)
# ─────────────────────────────────────────────

@app.route('/api/generate-questions', methods=['POST'])
@token_required
def generate_questions(current_user):
    data = request.get_json()
    skill = data.get('skill', 'python')
    difficulty = data.get('difficulty', 'beginner')

    api_key = os.getenv('OPENROUTER_API_KEY', '')
    
    import uuid
    seed = str(uuid.uuid4())

    # Try AI generation if key is valid
    if api_key and api_key != 'your_openrouter_api_key_here':
        prompt = f"""Generate 10 unique, random multiple choice questions for a {difficulty} level {skill} skill test.
Please ensure these questions are completely different from standard typical questions. (Randomizer seed: {seed})
Return ONLY a valid JSON array. No markdown, no explanation, no code fences.
Each object must have exactly these keys:
  "question": string,
  "options": array of 4 strings,
  "correct_answer": one of the 4 option strings exactly as written,
  "explanation": "A short, 1-2 sentence explanation of why the correct answer is correct and others might be wrong."
Example: [{{"question":"...","options":["A","B","C","D"],"correct_answer":"A","explanation":"..."}}]"""

        headers = {
            "Authorization": f"Bearer {api_key}",
            "HTTP-Referer": "http://localhost:5000",
            "X-Title": "SkillTest AI",
            "Content-Type": "application/json"
        }

        models = [
            "openai/gpt-4o-mini"
        ]

        for model in models:
            try:
                response = requests.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json={"model": model, "messages": [{"role": "user", "content": prompt}]},
                    timeout=45
                )
                if response.status_code == 200:
                    content = response.json()['choices'][0]['message']['content']
                    # Strip reasoning tags
                    content = re.sub(r'<think>.*?</think>', '', content, flags=re.DOTALL).strip()
                    
                    # Robust JSON array extraction
                    questions = None
                    try:
                        # Attempt direct parse first
                        questions = json.loads(content)
                    except json.JSONDecodeError:
                        # Fallback regex extraction if there's markdown or extra text
                        match = re.search(r'\[\s*\{.*?\}\s*\]', content, flags=re.DOTALL)
                        if match:
                            try:
                                questions = json.loads(match.group(0))
                            except json.JSONDecodeError:
                                pass
                    
                    if questions and isinstance(questions, list) and len(questions) >= 5:
                        print(f"✅ AI questions generated using: {model}")
                        return jsonify({'questions': questions[:10], 'source': 'ai', 'model': model})
                    print(f"⚠️ {model}: unparseable response, trying next...")
                else:
                    print(f"⚠️ {model}: HTTP {response.status_code}, trying next...")
            except Exception as e:
                print(f"⚠️ {model}: {str(e)}, trying next...")

        print("⚠️ All AI models failed — using fallback question bank")

    # Always fallback to built-in questions
    questions = get_fallback_questions(skill)
    print(f"📚 Serving fallback questions for: {skill}")
    return jsonify({'questions': questions, 'source': 'fallback'})

# ─────────────────────────────────────────────
# TEST SUBMIT & HISTORY
# ─────────────────────────────────────────────

@app.route('/api/submit-test', methods=['POST'])
@token_required
def submit_test(current_user):
    data = request.get_json()
    new_test = Test(
        user_id=current_user.id,
        skill=data.get('skill', 'unknown'),
        difficulty=data.get('difficulty', 'beginner'),
        score=data.get('score', 0),
        total_questions=data.get('total_questions', 10)
    )
    db.session.add(new_test)
    db.session.commit()
    return jsonify({'message': 'Test results saved', 'test_id': new_test.id})

@app.route('/api/user-history', methods=['GET'])
@token_required
def user_history(current_user):
    tests = Test.query.filter_by(user_id=current_user.id).order_by(Test.date.desc()).all()
    results = [{
        'id': t.id,
        'skill': t.skill,
        'difficulty': t.difficulty,
        'score': t.score,
        'total_questions': t.total_questions,
        'date': t.date.isoformat(),
        'percentage': round((t.score / t.total_questions) * 100, 2) if t.total_questions > 0 else 0
    } for t in tests]
    return jsonify({'history': results})

@app.route('/api/profile', methods=['GET'])
@token_required
def user_profile(current_user):
    return jsonify({
        'name': current_user.name,
        'email': current_user.email,
        'joined_at': 'Recently' # or current_user.id or similar since date is not on User model
    })

@app.route('/api/leaderboard', methods=['GET'])
def leaderboard():
    tests = db.session.query(Test, User).join(User, Test.user_id == User.id).all()
    results = []
    for t, u in tests:
        percentage = round((t.score / t.total_questions) * 100, 2) if t.total_questions > 0 else 0
        results.append({
            'user': u.name,
            'skill': t.skill,
            'difficulty': t.difficulty,
            'score': t.score,
            'total_questions': t.total_questions,
            'percentage': percentage,
            'date': t.date.isoformat()
        })
    # Sort by percentage then by total score
    results.sort(key=lambda x: (x['percentage'], x['score']), reverse=True)
    return jsonify({'leaderboard': results[:50]})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
