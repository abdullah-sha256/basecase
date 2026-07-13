# CodeNow

Preparing for technical interviews for software engineering positions can be a daunting process. The most common approach is to practice problems at [leetcode.com](http://leetcode.com/). However, with thousands of problems on the platform, it can get overwhelming for someone who has no idea where to start. Furthermore, even if you create your own plan for Leetcode problems, it quickly becomes cumbersome to track and manage your progress as you work through your plan. Lastly, it's important to take into account [Ebbinghaus's Forgetting Curve](https://www.mindtools.com/a9wjrjw/ebbinghauss-forgetting-curve) in your interview preparation. However, doing this manually is tedious and takes a lot of manual overhead.

CodeNow aims to improve the interview preparation workflow by providing the user with a customized Leetcode preparation plan based on the user's strengths and weaknesses with common technical interview concepts. CodeNow allows the user to create daily learning goals and schedules Leetcode problems for them to complete every day, while taking into account [Ebbinghaus's Forgetting Curve](https://www.mindtools.com/a9wjrjw/ebbinghauss-forgetting-curve). Additionally, CodeNow allows the user to visually see their progress as they work through their plan.

## Project Structure

- `backend-v2/` — Django 4 + Django REST Framework API (token auth, SQLite)
- `frontend-v2/` — Vite + React + TypeScript client (Chakra UI, TanStack Query, Zustand)

## Backend Setup

Requires Python 3 and `pipenv` (`pip3 install pipenv`).

```bash
cd backend-v2
pipenv shell
pipenv install
python3 manage.py migrate
python3 manage.py import_problems  # seed the problem set
python3 manage.py runserver
```

API docs are available at `http://localhost:8000/api/docs/` once the server is running.

## Frontend Setup

Requires Node.js and `npm`.

```bash
cd frontend-v2
npm install
npm run dev
```

## Contributing

Create a feature branch from `main` and submit a pull request. Commit messages and PR titles follow the `[#<issue>] <description>` convention, where `<issue>` is the GitHub issue number.
