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
	folder=`dirname $filename`;
	cd $folder;
	if [ "$cmd" == "watch" ]
	then
		echo "---------- watching $folder ----------"
		if [ "$OSTYPE" == "cygwin" ]
		then
			compass.bat watch &
		else
			compass watch &
		fi
	else
		echo "---------- compiling $folder ----------"
		compass compile
	fi
}
export -f do_compass
if [ "$cmd" == "watch" ]
then
	find . -name config.rb -exec bash -c 'do_compass "$0" watch' {} \;
else
	find . -name config.rb -exec bash -c 'do_compass "$0" compile' {} \;
fi
