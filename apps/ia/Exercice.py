from openai import OpenAI
import json
import re
import random

class Exercice:
    def __init__(self, data):
        self.retry_count = 0
        self.max_retries = 100
        self.data = data
        while self.retry_count < self.max_retries:
            try:
                self.processData()
                self.organize_requests()
                break  # Sortir de la boucle si tout se passe bien
            except Exception as e:
                self.retry_count += 1
                print(f"Erreur rencontrée : {e}. Tentative {self.retry_count}/{self.max_retries}...")
        else:
            print(f"Le programme a échoué après {self.max_retries} tentatives.")

    def processData(self):
        self.subject_exercice_backend = self.data["subject"]
        self.convert_subject_name()
        self.sous_sujet = self.data["sous_sujet"]
        self.moyenne_matiere = self.data["moyenne"]
        self.exercice_difficulty = self.moyenne_to_diff()
        self.generate_quiz_questions()
        self.qcm_nbr_anwsers = 4

    def convert_subject_name(self):
        dict_subject = {"Maths" : "mathématique", "Science" : "sciences", "History" : "histoire", "Geography" : "géographie", "English" : "anglais", "French" : "français", "Spanish" : "espagnol", "German" : "allemand"}
        self.subject_exercice_IA = dict_subject[self.subject_exercice_backend]

    def moyenne_to_diff(self):
        if self.moyenne_matiere<=7:
            return "simple"
        elif self.moyenne_matiere<=15:
            return "normal"
        else:
            return "difficile"

    def generate_quiz_questions(self):
        if self.exercice_difficulty == "simple":
            maxExo = 3
            
        elif self.exercice_difficulty == "normal":
            maxExo = 5
        else :
            maxExo = 7
        random_int = random.randint(0, maxExo)
        self.qcm_nbr_questions = random_int
        self.text_hole_nbr_questions = maxExo-random_int
    def organize_requests(self):
        self.very_final_json = {}
        self.very_final_json["name"] = f"Quizz {self.subject_exercice_backend} {self.sous_sujet}"
        self.very_final_json["questions"] = []
        if self.qcm_nbr_questions > 0:
            self.exercice_type = "qcm"
            self.chatgpt_api_request()
            self.fix_exercices()
        if self.text_hole_nbr_questions > 0:
            self.exercice_type = "text-hole"
            self.chatgpt_api_request()
            self.fix_exercices()

    def chatgpt_api_request(self):
        client = OpenAI(api_key="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")
        if self.exercice_type=="qcm" and self.subject_exercice_IA == "mathématique":
            model="ft:gpt-4o-mini-2024-07-18:personal::A9QpFOC0:ckpt-step-200"
            messages=[
                        {"role": "system", "content": ""},
                        {"role": "user", "content": f"{self.qcm_nbr_questions} QCM avec {self.qcm_nbr_anwsers} réponses possibles de difficulté {self.exercice_difficulty} en mathematique."}
                    ]
        elif self.exercice_type=="qcm" and self.subject_exercice_IA != "mathématique":
            model="ft:gpt-4o-mini-2024-07-18:personal::A9QpFOC0:ckpt-step-200"
            messages=[
                        {"role": "system", "content": ""},
                        {"role": "user", "content": f"{self.qcm_nbr_questions} QCM avec {self.qcm_nbr_anwsers} réponses possibles de difficulté {self.exercice_difficulty} en {self.subject_exercice_IA} sur {self.sous_sujet}."}
                    ]
        else : 
            model="ft:gpt-4o-mini-2024-07-18:personal::AB7doJU7:ckpt-step-80"
            messages=[
                        {"role": "system", "content": ""},
                        {"role": "user", "content": f"Génère un exercice de texte à trous comportant {self.text_hole_nbr_questions} textes qui ont chacun 1 trou portant sur {self.sous_sujet} en {self.subject_exercice_IA}."}
                    ]
        # Boucle pour réessayer en cas de problème de formatage JSON
        while True:
            try:
                response = client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=1.1
                )
                response_dict = response.model_dump()  
                self.response_message = response_dict["choices"][0]["message"]["content"]
                self.fix_json_structure()
                self.response_message_json = json.loads(self.response_message)
                break  

            except json.JSONDecodeError as e:
                print(f"Erreur JSON rencontrée : {e}. Nouvelle requête en cours...")
                continue  

    def fix_json_structure(self):
        self.response_message = re.sub(r'\bquestion\b', 'text', self.response_message)
        self.response_message = re.sub(r'\b<>\b', '@@', self.response_message)
    
    def fix_exercices(self):
        questions_to_keep = []
        if self.exercice_type == "qcm":
            for exercice in self.response_message_json["questions"]:
                if self.remove_qcm_if_multiple_true(exercice) == False:
                    self.response_message_json["questions"].remove(exercice)

        if self.subject_exercice_backend == "Maths" and self.exercice_type == "qcm":
            for i in range(len(self.response_message_json["questions"])):
                reponse_reelle = self.calculate_from_string(self.response_message_json["questions"][i]["text"])
                
                if reponse_reelle is not None:
                    fixed_reponses = self.fix_anwsers(reponse_reelle, self.response_message_json["questions"][i]["choices"])
                    self.response_message_json["questions"][i]["choices"] = fixed_reponses
                    questions_to_keep.append(self.response_message_json["questions"][i])
            self.response_message_json["questions"] = questions_to_keep
        if self.exercice_type == "qcm":
            for exercice in self.response_message_json["questions"]:
                self.very_final_json["questions"].append({"type" : self.exercice_type, "points" : exercice["points"], "question": exercice["text"], "choices" : exercice["choices"]})
        if self.exercice_type == "text-hole":
            for exercice in self.response_message_json["questions"]:
                if self.remove_text_hole_if_no_hole(exercice):
                    self.very_final_json["questions"].append({"type" : self.exercice_type, "points" : exercice["points"], "text": exercice["text"], "answers" : exercice["answers"]})
        if len(self.very_final_json["questions"]) == 0:
            self.retry_generation()  # Étape 2: Relancer le programme


    def remove_qcm_if_multiple_true(self, exercice):
        count_true = sum(choice['isCorrect'] for choice in exercice['choices'])
        if count_true > 1:
            print("Il y a plusieurs réponses correctes on dégage l'exo.")
            return False
        count_false = sum(not choice['isCorrect'] for choice in exercice['choices'])
        if count_false >= 4:
            print("Il y a trop de réponses incorrecte on dégage l'exo.")
            return False

    def remove_text_hole_if_no_hole(self, exercice):
        if "@@" not in exercice["text"]:
            return False
        return True
    
    def calculate_from_string(self, string):
        match_square_cube = re.search(r"Quel est le (carré|cube) de (\d+)", string)
        if match_square_cube:
            num = int(match_square_cube.group(2))
            operation = match_square_cube.group(1)
            if operation == 'carré':
                result = num ** 2
            elif operation == 'cube':
                result = num ** 3
            return str(result)

        match_basic = re.search(r"(\d+)\s*([\+\-\*/])\s*(\d+)", string)
        if match_basic:
            num1 = int(match_basic.group(1))
            operator = match_basic.group(2)
            num2 = int(match_basic.group(3))
            if operator == '/' and num2 == 0:
                print(f"Division par zéro détectée dans la question : {string}")
                return None
            
            if operator == '+':
                result = num1 + num2
            elif operator == '-':
                result = num1 - num2
            elif operator == '*':
                result = num1 * num2
            elif operator == '/':
                result = num1 / num2
                # Vérifier si le résultat est un entier
                if not result.is_integer():  # Si le résultat n'est pas un entier, on supprime la question
                    print(f"Division ne donnant pas un entier détectée : {string}")
                    return None

            return str(result)
        
        print(f"Pas de calcul trouvé dans la chaîne : {string}")
        return None

    def fix_anwsers(self, reponse_reelle, reponses_exercice):
        for reponse in reponses_exercice:
            if reponse["isCorrect"]:
                reponse_reelle = str(float(reponse_reelle))  
                if reponse_reelle.endswith('.0'):
                    reponse_reelle = reponse_reelle[:-2]
                reponse["label"] = reponse_reelle
        liste_de_toutes_les_reponses = []
        for reponse in reponses_exercice:
            liste_de_toutes_les_reponses.append(reponse["label"])
        for i in range(len(reponses_exercice)):
            if reponses_exercice[i]["isCorrect"]==False:
                for j in range(len(reponses_exercice)):
                    if i == j:
                        pass
                    else:
                        if reponses_exercice[i]["label"]==liste_de_toutes_les_reponses[j]:
                            while reponses_exercice[i]["label"] in liste_de_toutes_les_reponses:
                                reponses_exercice[i]["label"] = str(int(reponses_exercice[i]["label"])+1)
                            liste_de_toutes_les_reponses[i] = reponses_exercice[i]["label"]
        return reponses_exercice
    
    def retry_generation(self):
        self.processData()
        self.organize_requests()

    def add_ids_final_json(self):
        print("Start add_ids_final_json")
        quizzCounter=1
        questionCounter=1
        choixCounter=1
        self.very_final_json["id"]=str(quizzCounter)
        quizzCounter+=1
        for question in self.very_final_json["questions"]:
            question["id"] = str(questionCounter)
            questionCounter+=1
            if question["type"]=="qcm":
                for choix in question["choices"]:
                    choix["id"] = str(choixCounter)
                    choixCounter+=1

    def renvois_final_json(self):
        self.add_ids_final_json()
        return self.very_final_json