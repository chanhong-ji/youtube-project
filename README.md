# Youtube clone project

## 기술스택

- Node js
- express 웹 프레임워크
- MongoDB
- mongoose
- ES6
- amazon s3 (image upload)
- pug

  <br>

## DB

- mongoDB 를 이용한 데이터 관리
- mongoose 를 통해 모델 스키마 정의
- 세션 방식을 이용한 사용자 인증 관리

  <br>

## API

| Members                 | Method    | Description                |
| ----------------------- | --------- | -------------------------- |
| /                       | GET       | 비디오 목록 조회           |
| /join                   | GET, POST | 사용자 생성                |
| /login                  | GET, POST | 사용자 로그인              |
| /search                 | GET       | 검색된 비디오 목록 조회    |
| /users/logout           | GET       | 사용자 로그아웃            |
| /users/edit             | GET, POST | 사용자 정보 수정           |
| /users/github/start     | GET       | 사용자 깃허브 연동 로그인  |
| /users/github/finish    | GET       | 사용자 깃허브 연동 로그인2 |
| /users/change-password  | GET, POST | 사용자 패스워드 변경       |
| /users/:id              | GET       | 사용자 정보 조회           |
| /videos/:id             | POST      | 비디오 조회                |
| /videos/edit            | GET, POST | 비디오 수정                |
| /videos/delete          | GET       | 비디오 삭제                |
| /videos/upload          | GET, POST | 비디오 생성                |
| /api/videos/:id/view    | POST      | 비디오 메타데이터(뷰) 수정 |
| /api/videos/:id/comment | POST      | 댓글 생성                  |
| /api/comments/:id       | DELETE    | 댓글 삭제                  |
