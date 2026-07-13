# basecase

A LeetCode interview-prep tracker. It schedules problems for you, tracks your attempts, and shows your progress — with bigger ambitions around spaced repetition (see [Ebbinghaus's Forgetting Curve](https://www.mindtools.com/a9wjrjw/ebbinghauss-forgetting-curve)), though that's more of a goal than a shipped feature so far.

It started as a CSC301 course project back in Winter 2023, called CodeNext, and is now being rewritten from scratch under the basecase name.

## Project Structure

- `backend/` — Django 4 + Django REST Framework API (token auth, SQLite)
- `frontend/` — Vite + React + TypeScript client (Chakra UI, TanStack Query, Zustand)

## Backend Setup

Requires Python 3 and `pipenv` (`pip3 install pipenv`).

```bash
cd backend
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
cd frontend
npm install
npm run dev
```

## Contributing

Create a feature branch from `main` and submit a pull request. Commit messages and PR titles follow the `[#<issue>] <description>` convention, where `<issue>` is the GitHub issue number.
