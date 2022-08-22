set -ex
cd src/ 
echo "todo: fix me"
#find . -type f -iname \"*\" | grep -v \".tsx$\" | grep -v \".ts$\" | grep -v \".DS_Store\" | xargs tar cvf - | (cd ../dist ; tar xfp -)