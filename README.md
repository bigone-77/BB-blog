# BB-blog

결코 적지 않은 사람들이 자신들의 관심있는 분야에 대하여 블로그를 운영 한다.
나 역시 야구라는 취미에 대해서 꽤나 진심인 편이고, 이미 어느정도 형식이 잡힌 네이버, 구글, 등등이 있지만 
이미 만들어진 템플릿이 어떤 기능으로 작동이 되는지 실제로 만들기 위해선 어떤 기능을 넣어야 하는지에 대해 학습하고자 시작했다.
---

> 2023.06.12 ~ 2023.06.15 node 공부
>  > 2023.06.17 ~ 2023.06.19 라우트 활용 페이지 이동 및 포스팅
>    >  > 2023.06.23 ~ 2023.06.24 댓글 기능


---

# 프로젝트 폴더 정리

Data: mysql 연동

Public: svg 파일 및 사진파일

Routes: 동적 라우팅 작동

Views: 화면 구성 파일

Package.json: 핵심 모듈로는 ejs엔진, express 객체, mysql2 모듈 사용

App.js: 

            1. express.urlecoded로 post할때 쉽게 파싱가능하도록 구현

            2. static을 public 폴더로 확장하여 사진, 이미지를 띄워서 보일 수 있게 함

            3. 별도의 라우트를 사용하여 구조적으로 정돈되도록 함.
