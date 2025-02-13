#!/bin/bash

### 🖥️ Initialisation de l'environnement ###
clear
echo -e "\033[1;32m🚀 Lancement des tests unitaires et d'intégration...\033[0m"

# Définition du chemin du Bureau et création du dossier principal
DESKTOP_PATH="$HOME/Desktop"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    DESKTOP_PATH="$(echo ~/Desktop | sed 's/\\/\//g')" # Windows (Git Bash)
elif [[ "$OSTYPE" == "darwin"* ]]; then
    DESKTOP_PATH="$HOME/Desktop" # macOS
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    DESKTOP_PATH="$HOME/Bureau" # Linux
fi

MAIN_REPORT_DIR="$DESKTOP_PATH/test-dossier"
mkdir -p "$MAIN_REPORT_DIR"

# Définition du sous-dossier basé sur la date et l'heure
DATE_TIME=$(date +"%Y-%m-%d_%H-%M-%S")
REPORT_DIR="$MAIN_REPORT_DIR/$DATE_TIME"
mkdir -p "$REPORT_DIR"

# Définition des fichiers de sortie
REPORT_JSON="$REPORT_DIR/test-results.json"
REPORT_LOG="$REPORT_DIR/test-results.log"
REPORT_CSV="$REPORT_DIR/test-results.csv"
REPORT_PDF="$REPORT_DIR/test-report.pdf"
REPORT_DOCX="$REPORT_DIR/test-report.docx"

# Définition des couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m' # Pas de couleur

### 🛠️ Vérification et Installation des Dépendances ###
echo -e "${BLUE}🔍 Vérification des dépendances...${NC}"

# Vérification de Node.js & npm
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️ Node.js non trouvé, installation en cours...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️ npm non trouvé, installation en cours...${NC}"
    sudo apt install -y npm
fi

# Vérification de Jest
if ! npm list -g --depth=0 jest &> /dev/null; then
    echo -e "${YELLOW}⚠️ Jest non trouvé, installation en cours...${NC}"
    npm install -g jest
fi

# Vérification de Pandoc
if ! command -v pandoc &> /dev/null; then
    echo -e "${YELLOW}⚠️ Pandoc non trouvé, installation en cours...${NC}"
    sudo apt install -y pandoc
fi

# Vérification de jq pour traitement JSON
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️ jq non trouvé, installation en cours...${NC}"
    sudo apt install -y jq
fi

echo -e "${GREEN}✅ Toutes les dépendances sont installées.${NC}"

### 🖥️ Exécution des tests Jest avec logs en direct ###
echo -e "${BLUE}🖥️ Lancement des tests Jest...${NC}"
npm test -- --json --outputFile="$REPORT_JSON" --coverage 2>&1 | tee "$REPORT_LOG"

### 📊 Extraction des données Jest ###
TOTAL_TESTS=$(jq '.numTotalTests' "$REPORT_JSON")
SUCCESS_TESTS=$(jq '.numPassedTests' "$REPORT_JSON")
FAILED_TESTS=$(jq '.numFailedTests' "$REPORT_JSON")
TOTAL_COVERAGE=$(jq '.coverageMap | to_entries | map(.value.statementMap | length) | add' "$REPORT_JSON")

### 📜 Export des résultats en CSV ###
echo "Catégorie,Valeur" > "$REPORT_CSV"
echo "Total des tests,$TOTAL_TESTS" >> "$REPORT_CSV"
echo "Tests réussis,$SUCCESS_TESTS" >> "$REPORT_CSV"
echo "Tests échoués,$FAILED_TESTS" >> "$REPORT_CSV"
echo "Couverture du code,$TOTAL_COVERAGE" >> "$REPORT_CSV"

### 📊 Génération des graphiques ###
python3 - <<END
import json
import matplotlib.pyplot as plt
import pandas as pd

# Chargement des données Jest
with open("$REPORT_JSON", "r") as f:
    data = json.load(f)

total_tests = data["numTotalTests"]
success_tests = data["numPassedTests"]
failed_tests = data["numFailedTests"]

# Génération du camembert
labels = ['Succès', 'Échec']
sizes = [success_tests, failed_tests]
colors = ['green', 'red']
plt.figure(figsize=(5, 5))
plt.pie(sizes, labels=labels, autopct='%1.1f%%', colors=colors, startangle=140)
plt.title("Répartition des Tests")
plt.savefig("$REPORT_DIR/pie_chart.png")

# Génération de l'histogramme
categories = ["Total", "Succès", "Échec"]
values = [total_tests, success_tests, failed_tests]
plt.figure(figsize=(5, 5))
plt.bar(categories, values, color=["blue", "green", "red"])
plt.title("Nombre de Tests")
plt.savefig("$REPORT_DIR/bar_chart.png")
END

### 📜 Génération du rapport PDF et Word ###
echo -e "${BLUE}📄 Génération du rapport PDF et Word avec mise en page avancée...${NC}"
echo -e "# 📊 Rapport de Tests Jest\n\n## 1. Page de Garde\n\n" > "$REPORT_DIR/report.md"
echo -e "**Projet**: Test Automation\n**Date**: $(date)\n\n---\n\n## 2. Sommaire\n\n1. Introduction\n2. Résumé des Tests\n3. Résultats Détaillés\n4. Graphiques et Analyse\n5. Recommandations\n\n---\n\n## 3. Résumé des Tests\n\n- **Total des tests** : $TOTAL_TESTS\n- ✅ **Tests réussis** : $SUCCESS_TESTS\n- ❌ **Tests échoués** : $FAILED_TESTS\n- 📊 **Couverture totale du code** : $TOTAL_COVERAGE\n\n" >> "$REPORT_DIR/report.md"
echo -e "## 4. Graphiques\n\n![Répartition](pie_chart.png)\n\n![Histogramme](bar_chart.png)\n\n## 5. Recommandations\n\n" >> "$REPORT_DIR/report.md"
echo -e "**Suggestions**:\n- Vérifier les tests échoués\n- Améliorer la couverture du code\n- Optimiser le temps d’exécution\n\n## 6. Logs Complet Jest\n\n" >> "$REPORT_DIR/report.md"
cat "$REPORT_LOG" >> "$REPORT_DIR/report.md"

pandoc "$REPORT_DIR/report.odt" -o "$REPORT_PDF"
pandoc "$REPORT_DIR/report.odt" -o "$REPORT_DOCX"

### 📍 Affichage du rapport généré ###
echo -e "${GREEN}📂 Rapport généré : ${REPORT_PDF}${NC}"
echo -e "${GREEN}📂 Rapport Word généré : ${REPORT_DOCX}${NC}"

### 🔥 Fin du script ###
exit 0
