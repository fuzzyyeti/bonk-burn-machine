while read f;
do
	ts-node sign_nfts.ts $f
done <sign_list1.txt

