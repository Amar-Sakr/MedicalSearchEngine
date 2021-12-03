FROM python:3.10

ENV PYTHONPATH=/src

WORKDIR /src

COPY . .

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

EXPOSE 7777

CMD python3 src/app.py