# -*- coding: utf-8 -*-
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

import os
FONT_DIR = os.path.expanduser("~/Library/Fonts")
pdfmetrics.registerFont(TTFont('Malgun', f'{FONT_DIR}/NanumGothic-Regular.ttf'))
pdfmetrics.registerFont(TTFont('MalgunBold', f'{FONT_DIR}/NanumGothic-Bold.ttf'))

FONT_BODY = 'Malgun'
FONT_HEAD = 'MalgunBold'

ACCENT = colors.HexColor('#E5722A')
TEXT = colors.HexColor('#171717')
DIM = colors.HexColor('#737373')
BORDER = colors.HexColor('#E5E5E5')

styles = {
    'name': ParagraphStyle('name', fontName=FONT_HEAD, fontSize=22, textColor=TEXT, leading=26),
    'role': ParagraphStyle('role', fontName=FONT_HEAD, fontSize=12, textColor=ACCENT, leading=16, spaceAfter=4),
    'contact': ParagraphStyle('contact', fontName=FONT_BODY, fontSize=9, textColor=DIM, leading=13),
    'h2': ParagraphStyle('h2', fontName=FONT_HEAD, fontSize=12, textColor=TEXT, spaceBefore=14, spaceAfter=6),
    'body': ParagraphStyle('body', fontName=FONT_BODY, fontSize=9.3, textColor=TEXT, leading=14.5),
    'bodyDim': ParagraphStyle('bodyDim', fontName=FONT_BODY, fontSize=9, textColor=DIM, leading=14),
    'bullet': ParagraphStyle('bullet', fontName=FONT_BODY, fontSize=9, textColor=TEXT, leading=14, leftIndent=10, spaceAfter=2),
    'itemTitle': ParagraphStyle('itemTitle', fontName=FONT_HEAD, fontSize=10, textColor=TEXT, leading=14),
    'itemMeta': ParagraphStyle('itemMeta', fontName=FONT_BODY, fontSize=8.3, textColor=DIM, leading=12),
    'tag': ParagraphStyle('tag', fontName=FONT_BODY, fontSize=8.3, textColor=DIM, leading=12),
}

doc = SimpleDocTemplate(
    "resume.pdf", pagesize=A4,
    topMargin=20 * mm, bottomMargin=16 * mm, leftMargin=20 * mm, rightMargin=20 * mm,
)

story = []

story.append(Paragraph("박영준", styles['name']))
story.append(Paragraph("Full-Stack Developer", styles['role']))
story.append(Paragraph(
    "대한민국, 대구 &nbsp;·&nbsp; pyjun0313@gmail.com &nbsp;·&nbsp; github.com/pyj-0313 &nbsp;·&nbsp; mytails.site",
    styles['contact']
))
story.append(Spacer(1, 10))
story.append(HRFlowable(width="100%", thickness=1.2, color=ACCENT))
story.append(Spacer(1, 4))

# About
story.append(Paragraph("About", styles['h2']))
story.append(Paragraph(
    "컴퓨터에 대한 관심에서 출발해 대학교 전공 수업에서 코딩을 처음 접한 뒤 개발에 흥미를 느껴 "
    "본격적으로 공부를 시작했습니다. 기획부터 백엔드, 프론트엔드까지 서비스의 처음과 끝을 직접 "
    "만들어보는 과정에 관심이 많고, 새로운 기술을 배워 문제를 해결하는 개발자로 꾸준히 성장하고 "
    "싶습니다.",
    styles['body']
))

# Skills
story.append(Paragraph("Skills", styles['h2']))
skills_data = [
    ["Backend", "Java, Spring Boot, Hibernate, MySQL, Redis"],
    ["Frontend", "HTML5, React, JavaScript, Vite, Sass, Axios"],
    ["Infra / Tools", "Docker, Nginx, GitHub Actions, Jenkins, AWS, Firebase, Jira, IntelliJ, VS Code"],
]
skills_table = Table(
    [[Paragraph(f"<b>{k}</b>", styles['itemMeta']), Paragraph(v, styles['bodyDim'])] for k, v in skills_data],
    colWidths=[32 * mm, 128 * mm]
)
skills_table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 1),
]))
story.append(skills_table)

# Experience
story.append(Paragraph("Experience", styles['h2']))
story.append(Paragraph("국비 풀스택 개발자 양성과정 &nbsp;&nbsp;<font color='#737373' size='8'>2026.02 – 2026.08 (수료)</font>", styles['itemTitle']))
story.append(Paragraph("코리아AI아카데미 대구점 · 공공데이터 융합 (113일 · 900시간)", styles['itemMeta']))
story.append(Spacer(1, 6))

# Education
story.append(Paragraph("Education", styles['h2']))
story.append(Paragraph("경일대학교 &nbsp;&nbsp;<font color='#737373' size='8'>2025 졸업</font>", styles['itemTitle']))
story.append(Paragraph("스마트팩토리융합학과", styles['itemMeta']))
story.append(Spacer(1, 4))
story.append(Paragraph("자격 &amp; 면허: 정보처리기사(2026.06 필기 합격·실기 준비중), SQLD(2026.08 응시예정) · 운전면허 1종 보통(2019.08 취득)", styles['bodyDim']))

# Projects
story.append(Paragraph("Projects", styles['h2']))

story.append(Paragraph(
    "Tails — 반려동물 동반 여행 서비스 &nbsp;&nbsp;"
    "<font color='#737373' size='8'>2026.07 – 2026.08 · 팀 2인</font>",
    styles['itemTitle']
))
tails_bullets = [
    "장소 키워드·카테고리·지역·반경 검색, 평점·찜 기반 랭킹 구현",
    "찜·리뷰 이력 기반 콘텐츠 기반 개인화 추천(코사인 유사도) 구현",
    "여행 일정 CRUD 및 최근접 이웃 알고리즘 기반 경로 최적화 추천 기능 구현",
    "TourAPI(한국관광공사) 연동을 통한 장소 데이터 동기화",
    "프론트엔드 공통 인프라(axios, 라우팅) 및 지도·피드 화면 구현",
]
for b in tails_bullets:
    story.append(Paragraph(f"• {b}", styles['bullet']))
story.append(Paragraph("Tech: Java, Spring Boot, MySQL, Redis, React, Docker, Jenkins, AWS", styles['tag']))
story.append(Paragraph("mytails.site &nbsp;·&nbsp; github.com/tailsProject/Tails", styles['tag']))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "Maple Shooting Game — 바닐라 JS 브라우저 슈팅 게임 "
    "<font color='#737373' size='8'>(첫 프로젝트)</font>",
    styles['itemTitle']
))
story.append(Paragraph(
    "메이플스토리 주황버섯을 모티브로 한 슈팅 게임. 좌표 이동, 오브젝트 배열 관리, 충돌 판정 로직을 익힌 자바스크립트 입문 프로젝트.",
    styles['bullet']
))
story.append(Paragraph("Tech: JavaScript, HTML &nbsp;·&nbsp; github.com/pyj-0313/Maple-Shooting-game", styles['tag']))

doc.build(story)
print("resume.pdf generated")
