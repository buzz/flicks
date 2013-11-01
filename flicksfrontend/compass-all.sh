#!/bin/bash
# usage: compass-all.sh watch
# or     compass-all.sh compile

if [ "$1" == "compile" ]
then
  cmd=compile
else
  cmd=watch
fi

do_compass () {
	filename=$1;
	cmd=$2;
	basename=$(basename ${filename});
	folder=`dirname $filename`;
	cd $folder;
	if [ "$cmd" == "watch" ]
	then
		echo "---------- watching $folder ----------"
		compass watch -c ${basename} &
	else
		echo "---------- compiling $folder ----------"
		compass compile -c ${basename}
	fi
}
export -f do_compass
if [ "$cmd" == "watch" ]
then
	find . -name compass-config.rb -exec bash -c 'do_compass {} watch' \;
else
	find . -name compass-config.rb -exec bash -c 'do_compass {} compile' \;
fi
