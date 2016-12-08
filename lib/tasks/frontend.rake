require "rainbow"

desc "Runs the frontend React mocha tests"
task :mocha do
  puts(ShellCommand.run("pwd"))
  mocha_result = ShellCommand.run("npm test")

  if mocha_result
    puts Rainbow("Passed. All frontend react tests look good").green
  else
    puts Rainbow("Failed. Please check the mocha tests in client/test").red
  end
end
