let "item=31"
while read f;
do
	ts-node update_metadata.ts $item $f
	let "item=item-1"
done <sign_list1.txt

