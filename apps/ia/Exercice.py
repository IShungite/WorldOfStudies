from openai import OpenAI
import json
import re
import random

class Exercice:
    def __init__(self, data):
        print("hfuerhjgvirjogrjfjfjkrjhfjerh")
        self.data = data
        self.processData()
        self.chatgpt_api_request()
        self.fix_exercices()

    def processData(self):
        self.matiere_exercice = self.data["subject"]
        self.moyenne_matiere = self.data["moyenne"]
        self.exercice_difficulty = self.moyenne_to_diff()
        self.generate_quiz(self.exercice_difficulty)
        self.qcm_nbr_anwsers = 4

    def generate_quiz(self, difficulty):
        if difficulty == "simple":
            maxExo = 5
            random_int = random.randint(0, 5)
            self.qcm_nbr_questions = random_int
            self.text_hole_nbr_questions = maxExo-random_int
        elif difficulty == "normal":
            maxExo = 7
            random_int = random.randint(0, 7)
            self.qcm_nbr_questions = random_int
            self.text_hole_nbr_questions = maxExo-random_int
        else :
            maxExo = 10
            random_int = random.randint(0, 10)
            self.qcm_nbr_questions = random_int
            self.text_hole_nbr_questions = maxExo-random_int

    def moyenne_to_diff(self):
        if self.moyenne_matiere<=7:
            return "simple"
        elif self.moyenne_matiere<=15:
            return "normal"
        else:
            return "difficile"
        
    def chatgpt_api_request(self):
        # if self.matiere_exercice == "Maths" : 
            # api_key="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"
        client = OpenAI(api_key="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")

        # Boucle pour réessayer en cas de problème de formatage JSON
        while True:
            try:
                # Effectuer la requête
                response = client.chat.completions.create(
                    model="ft:gpt-4o-mini-2024-07-18:personal::A9QpFOC0:ckpt-step-200",
                    messages=[
                        {"role": "system", "content": ""},
                        {"role": "user", "content": f"{self.qcm_nbr_questions} QCM avec {self.qcm_nbr_anwsers} réponses possibles de difficulté {self.exercice_difficulty} en {self.matiere_exercice}."}
                    ],
                    temperature=1.0
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
    
    def fix_exercices(self):
        if self.matiere_exercice == "Maths":
            questions_to_keep = []
            
            for i in range(len(self.response_message_json["questions"])):
                reponse_reelle = self.calculate_from_string(self.response_message_json["questions"][i]["text"])
                
                if reponse_reelle is not None:
                    fixed_reponses = self.fix_anwsers(reponse_reelle, self.response_message_json["questions"][i]["choices"])
                    self.response_message_json["questions"][i]["choices"] = fixed_reponses
                    questions_to_keep.append(self.response_message_json["questions"][i])
            
            self.response_message_json["questions"] = questions_to_keep
            
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
    
    def renvois_final_json(self):
        print(self.response_message_json)
        return self.response_message_json
    
    # def create_final_json(self):
    #     print(self.response_message_json)
    #     with open('outputExercice.json', 'w', encoding="utf-8") as outfile:
    #         json.dump(self.response_message_json, outfile, ensure_ascii=False)