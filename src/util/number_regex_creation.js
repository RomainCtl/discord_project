const c_duration = "-d[ ]+($1)";

class MyR {
    /**
     * Check end of string match with pattern
     * @param {string} pattern pattern to check
     * @param {string} str string where check
     */
    end_match_with(pattern, str) {
        for (let i=pattern.length-1 ; i>=0 ; i--) {
            let j = (str.length-1) - ((pattern.length-1)-i);
            if (str.length-i <= 0 || pattern[i] != str[j]) return false;
        }
        return true;
    }

    /**
     * Permet de concatener une regex (les [0-9])
     * @param {string list} result list of part of regex to concat
     * @param {boolean} is_min minore or majore
     */
    concat(result, is_min) {
        for (let i=0 ; i<result.length ; i++) {
            // count number of '[0-9]' repetition
            let nb=0;
            while (this.end_match_with("[0-9]", result[i])) {
                result[i] = result[i].slice(0, -5);
                nb++;
            }
            if (nb == 1) result[i] +="[0-9]";
            else if (nb>1) {
                if (result[i] == "" && is_min) result[i] += "[0-9]{,"+nb+"}";
                else if (result[i] == "[1-9]" && !is_min) result[i] += "[0-9]{"+nb+",}";
                else result[i] += "[0-9]{"+nb+"}";
            }
        }
        return result.join("|");
    }

    /**
     * create regex from list of interval
     * @param {int list} interval intervals cree par 'parse_into_interval'
     */
    parse_into_regex_block(interval, is_min) {
        let result = [];
        for (let i=0 ; i<interval.length ; i++) {
            if (interval[i][0] == interval[i][1]) result.push(interval[i][0]);
            else {
                let en = interval[i][0].toString().split(""),
                    st = interval[i][1].toString().split("");
                let r = "";
                for (let j=0 ; j<en.length ; j++) {
                    if (en[j] == st[j]) r += en[j];
                    else {
                        if (is_min) r += "[0-"+en[j]+"]";
                        else r += "["+en[j]+"-9]";
                    }
                }
                result.push(r);
            }
        }
        return this.concat(result, is_min);
    }
}

class MinRegex extends MyR {
    /**
     * return previous valeur pour un interval : 367 -> 360, 359 -> 300, etc
     * @param {int} num
     */
    prev(num) {
        let chars = num.toString().split("");
        // on parcour en partant de la fin (ex pour num=3600 : 0,0,6,3)
        for (let i=chars.length-1 ; i>=0 ; i--) {
            if (chars[i] == '9') { // a chaque fois que l'on rencontre un '9', on le replace par un '0'
                chars[i] = '0';
            } else { // a la première valeur différente de '9', on la replace aussi (sauf si c'est la dernière), et on quitte !
                if (i == 0) chars[i] = '1';
                else chars[i] = '0';
                break;
            }
        }
        return parseInt(chars.join(""));
    }

    /**
     * create interval for regex (3600 -> [3600,3600],[3599,3000],[2999,1000],[999,0])
     * @param {int} num
     */
    parse_into_interval(num) {
        let result = [];
        let previous = num;
        while (previous >= 0) {
            let p = this.prev(previous);
            result.push([previous, p]);
            previous = parseInt(p)-1;
        }
        return result;
    }

    static run(num) {
        let instance = new MinRegex();
        let intervals = instance.parse_into_interval( num );
        return instance.parse_into_regex_block(intervals, true);
    }
}

class MaxRegex extends MyR {
    /**
     * return next valeur pour un interval : 367 -> 399, 400 -> 999
     * @param {int} num
     */
    next(num) {
        let chars = num.toString().split("");
    for (let i=chars.length-1; i>=0;i--) {
        // change each 0 tp 9. ex: 190->199
        if (chars[i]=='0') {
            chars[i] = '9';
        } else { // si un autre digit est rencontre, change to 9, ex: 195->199, 150->199
            chars[i] = '9';
            break;
        }
    }
    return parseInt(chars.join(""));
    }

    /**
     * create interval for regex (3600 -> [3600,3999],[4000,9999],[10000,99999])
     * @param {int} num
     */
    parse_into_interval(num) {
        let result = [];
        let next_v = num;
        // tant que la dernière interval n'est pas du style [10+, 9+]
        while (result.length == 0 || !( (result[result.length-1][1]).toString().match('^9+$', 'i') && result[result.length-1][0].toString().match('^10+$', 'i'))) {
            let p = this.next(next_v);
            result.push([next_v, p]);
            next_v = parseInt(p)+1;
        }
        return result;
    }

    static run(num) {
        let instance = new MaxRegex();
        let intervals = instance.parse_into_interval( num );
        return instance.parse_into_regex_block(intervals, false);
    }
}

class NumberRegexCreation {
    create_regex_duration(text) {
        if (text.substring(0,1) == "<") { // <3600 => $1="3600|3[0-5][0-9]{2}|[0-2][0-9]{3}|[0-9]{,3}"
            return c_duration.replace('$1', MinRegex.run( parseInt( text.substr(1) ) ));
        } else if (text.substring(0,1) == ">") { // >3600 => $1="3[6-9][0-9]{2}|[4-9][0-9]{3}|[1-9][0-9]{4,}"
            return c_duration.replace('$1', MaxRegex.run( parseInt( text.substr(1) ) ));
        } else {
            throw "bad expression";
        }
    }
}

module.exports = NumberRegexCreation;