from elasticsearch import Elasticsearch
from config import ELASTICSEARCH_CONFIG


class SearchEngine:
    def __init__(self):
        self.es = Elasticsearch(
            [{'host': ELASTICSEARCH_CONFIG['ELASTIC_HOST'], 'port': ELASTICSEARCH_CONFIG['ELASTIC_PORT']}],
            http_auth=(ELASTICSEARCH_CONFIG['ELASTIC_USERNAME'],ELASTICSEARCH_CONFIG['ELASTIC_PASSWORD'])
        )
        self.Index_Name = ELASTICSEARCH_CONFIG['INDEX_NAME']
        self.RETRIEVED_DOCS_SIZE = 10
        self.SEARCH_TIMEOUT = 30

    def search_query(self, query):
        try:
            body = {
                'query': {
                    'bool': {
                        "should": [
                            {"match": {"brief_summary": {"query": query}}},
                        ],
                    }
                }
            }

            res = self.es.search(
                index=self.Index_Name,
                body=body,
                size=self.RETRIEVED_DOCS_SIZE,
                request_timeout=self.SEARCH_TIMEOUT
            )
            print(f"[INFO] {res['hits']['total']['value']} documents found")
        except Exception as ex:
            print("[WARNING] some exception has occurred!")
            print(f"Error in searching query, cause {ex}")
            return []
        try:
            docs_list = []
            for doc_contant in res['hits']['hits']:
                doc = doc_contant['_source']
                doc["bm25_score"] = doc_contant["_score"]
                docs_list.append(doc)
            return docs_list
        except Exception as ex:
            print("[WARNING] some exception has occurred!")
            print(ex)
            return []


if __name__ == '__main__':
    obj = SearchEngine()
    from pprint import pprint
    pprint(obj.search_query("skin cancer"))